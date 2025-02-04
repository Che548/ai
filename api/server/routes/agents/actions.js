const express = require('express');
const { nanoid } = require('nanoid');
const { actionDelimiter, SystemRoles } = require('librechat-data-provider');
const { encryptMetadata, domainParser } = require('~/server/services/ActionService');
const { updateAction, getActions, deleteAction } = require('~/models/Action');
const { isActionDomainAllowed } = require('~/server/services/domains');
const { getAgent, updateAgent } = require('~/models/Agent');
const fetch = require('node-fetch');
const { logger } = require('~/config');
const { HttpsProxyAgent } = require('https-proxy-agent');

const router = express.Router();

// If the user has ADMIN role
// then action edition is possible even if not owner of the assistant
const isAdmin = (req) => {
  return req.user.role === SystemRoles.ADMIN;
};

/**
 * Retrieves all user's actions
 * @route GET /actions/
 * @param {string} req.params.id - Assistant identifier.
 * @returns {Action[]} 200 - success response - application/json
 */
router.get('/', async (req, res) => {
  try {
    const admin = isAdmin(req);
    // If admin, get all actions, otherwise only user's actions
    const searchParams = admin ? {} : { user: req.user.id };
    res.json(await getActions(searchParams));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route to initiate OAuth login.
 * GET /actions/:action_id/oauth/login
 *
 * Retrieves the action, generates a random state (stored in session), constructs
 * the OAuth provider authorization URL using the action's OAuth configuration,
 * and redirects the user to that URL.
 */
router.get('/:action_id/oauth/login', async (req, res) => {
  const { action_id } = req.params;

  try {
    // Retrieve the action from the database
    const actions = await getActions({ action_id });
    if (!actions || actions.length === 0) {
      return res.status(404).send('Action not found');
    }
    const action = actions[0];

    // Generate a random state and store it in session for later verification
    const state = nanoid();
    req.session.oauthState = state; // Assumes express-session is set up

    // Build the redirect URI (should match your registered callback)
    const redirectUri = `${process.env.DOMAIN_CLIENT}/actions/${action_id}/oauth/callback`;

    // Build the OAuth authorization URL.
    const params = new URLSearchParams({
      client_id: action.metadata.oauth_client_id,
      redirect_uri: redirectUri,
      scope: action.metadata.auth.scope,
      state,
    });
    const authUrl = `${action.metadata.auth.authorization_url}?${params.toString()}`;

    // Redirect the user to the OAuth provider.
    res.redirect(authUrl);
  } catch (error) {
    logger.error('OAuth login error:', error);
    res.status(500).send('OAuth login failed');
  }
});

/**
 * OAuth Callback
 * GET /actions/:action_id/oauth/callback
 *
 * This route is used as the OAuth callback. It receives the authorization code
 * and state from the OAuth provider, validates the state, exchanges the code for an access token,
 * and updates the corresponding action document.
 */
router.get('/:action_id/oauth/callback', async (req, res) => {
  const { action_id } = req.params;
  const { code, state } = req.query;

  try {
    // Validate the state parameter using the value stored in session.
    if (!req.session.oauthState || req.session.oauthState !== state) {
      return res.status(400).send('Invalid state parameter');
    }
    // Clear the stored state from session.
    delete req.session.oauthState;

    // Retrieve the action from the database
    const actions = await getActions({ action_id });
    if (!actions || actions.length === 0) {
      return res.status(404).send('Action not found');
    }
    const action = actions[0];

    // Build URL-encoded parameters for token exchange.
    const params = new URLSearchParams({
      client_id: action.metadata.oauth_client_id,
      client_secret: action.metadata.oauth_client_secret,
      code: code,
      redirect_uri: `http://localhost:3080/actions/${action_id}/oauth/callback`,
      grant_type: 'authorization_code',
    });

    // Build the options for fetch.
    const options = {
      method: 'POST',
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    };

    if (process.env.PROXY) {
      options.agent = new HttpsProxyAgent(process.env.PROXY);
    }

    // Exchange the authorization code for an access token.
    const tokenResponse = await fetch(action.metadata.auth.client_url, options);
    if (!tokenResponse.ok) {
      throw new Error(`${tokenResponse.statusText} (HTTP ${tokenResponse.status})`);
    }
    const tokenData = await tokenResponse.json();

    // Build a nested update object using proper names.
    const updateData = {
      metadata: {
        oauth_access_token: tokenData.access_token,
        oauth_refresh_token: tokenData.refresh_token,
        ...(tokenData.expires_in && {
          oauth_token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000),
        }),
      },
    };

    // Update the action document with the new token data.
    await updateAction({ action_id }, updateData);

    // Optionally, redirect the user back to your chat UI or close the popup.
    res.send('Authentication successful. You can close this window.');
  } catch (error) {
    console.error('OAuth callback error:', error.message);
    res.status(500).send('Token exchange failed');
  }
});

/**
 * Adds or updates actions for a specific agent.
 * @route POST /actions/:agent_id
 * @param {string} req.params.agent_id - The ID of the agent.
 * @param {FunctionTool[]} req.body.functions - The functions to be added or updated.
 * @param {string} [req.body.action_id] - Optional ID for the action.
 * @param {ActionMetadata} req.body.metadata - Metadata for the action.
 * @returns {Object} 200 - success response - application/json
 */
router.post('/:agent_id', async (req, res) => {
  try {
    const { agent_id } = req.params;

    /** @type {{ functions: FunctionTool[], action_id: string, metadata: ActionMetadata }} */
    const { functions, action_id: _action_id, metadata: _metadata } = req.body;
    if (!functions.length) {
      return res.status(400).json({ message: 'No functions provided' });
    }

    let metadata = await encryptMetadata(_metadata);
    const isDomainAllowed = await isActionDomainAllowed(metadata.domain);
    if (!isDomainAllowed) {
      return res.status(400).json({ message: 'Domain not allowed' });
    }

    let { domain } = metadata;
    domain = await domainParser(req, domain, true);

    if (!domain) {
      return res.status(400).json({ message: 'No domain provided' });
    }

    const action_id = _action_id ?? nanoid();
    const initialPromises = [];
    const admin = isAdmin(req);

    // If admin, can edit any agent, otherwise only user's agents
    const agentQuery = admin ? { id: agent_id } : { id: agent_id, author: req.user.id };
    // TODO: share agents
    initialPromises.push(getAgent(agentQuery));
    if (_action_id) {
      initialPromises.push(getActions({ action_id }, true));
    }

    /** @type {[Agent, [Action|undefined]]} */
    const [agent, actions_result] = await Promise.all(initialPromises);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found for adding action' });
    }

    if (actions_result && actions_result.length) {
      const action = actions_result[0];
      metadata = { ...action.metadata, ...metadata };
    }

    const { actions: _actions = [], author: agent_author } = agent ?? {};
    const actions = [];
    for (const action of _actions) {
      const [_action_domain, current_action_id] = action.split(actionDelimiter);
      if (current_action_id === action_id) {
        continue;
      }

      actions.push(action);
    }

    actions.push(`${domain}${actionDelimiter}${action_id}`);

    /** @type {string[]}} */
    const { tools: _tools = [] } = agent;

    const tools = _tools
      .filter((tool) => !(tool && (tool.includes(domain) || tool.includes(action_id))))
      .concat(functions.map((tool) => `${tool.function.name}${actionDelimiter}${domain}`));

    const updatedAgent = await updateAgent(agentQuery, { tools, actions });

    // Only update user field for new actions
    const actionUpdateData = { metadata, agent_id };
    if (!actions_result || !actions_result.length) {
      // For new actions, use the agent owner's user ID
      actionUpdateData.user = agent_author || req.user.id;
    }

    /** @type {[Action]} */
    const updatedAction = await updateAction(
      { action_id },
      actionUpdateData,
    );

    const sensitiveFields = ['api_key', 'oauth_client_id', 'oauth_client_secret'];
    for (let field of sensitiveFields) {
      if (updatedAction.metadata[field]) {
        delete updatedAction.metadata[field];
      }
    }

    res.json([updatedAgent, updatedAction]);
  } catch (error) {
    const message = 'Trouble updating the Agent Action';
    logger.error(message, error);
    res.status(500).json({ message });
  }
});

/**
 * Deletes an action for a specific agent.
 * @route DELETE /actions/:agent_id/:action_id
 * @param {string} req.params.agent_id - The ID of the agent.
 * @param {string} req.params.action_id - The ID of the action to delete.
 * @returns {Object} 200 - success response - application/json
 */
router.delete('/:agent_id/:action_id', async (req, res) => {
  try {
    const { agent_id, action_id } = req.params;
    const admin = isAdmin(req);

    // If admin, can delete any agent, otherwise only user's agents
    const agentQuery = admin ? { id: agent_id } : { id: agent_id, author: req.user.id };
    const agent = await getAgent(agentQuery);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found for deleting action' });
    }

    const { tools = [], actions = [] } = agent;

    let domain = '';
    const updatedActions = actions.filter((action) => {
      if (action.includes(action_id)) {
        [domain] = action.split(actionDelimiter);
        return false;
      }
      return true;
    });

    domain = await domainParser(req, domain, true);

    if (!domain) {
      return res.status(400).json({ message: 'No domain provided' });
    }

    const updatedTools = tools.filter((tool) => !(tool && tool.includes(domain)));

    await updateAgent(agentQuery, { tools: updatedTools, actions: updatedActions });
    // If admin, can delete any action, otherwise only user's actions
    const actionQuery = admin ? { action_id } : { action_id, user: req.user.id };
    await deleteAction(actionQuery);
    res.status(200).json({ message: 'Action deleted successfully' });
  } catch (error) {
    const message = 'Trouble deleting the Agent Action';
    logger.error(message, error);
    res.status(500).json({ message });
  }
});

module.exports = router;
