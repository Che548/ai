const express = require('express');
const router = express.Router();
const { titleConvo } = require('../../../app/');
const { getOpenAIModels } = require('../endpoints');
const ChatAgent = require('../../../app/langchain/agents/ChatAgent');
const { validateTools } = require('../../../app/langchain/tools');
const { saveMessage, getConvoTitle, saveConvo, getConvo } = require('../../../models');
const { handleError, sendMessage, createOnProgress, formatSteps, formatAction } = require('./handlers');

router.post('/', async (req, res) => {
  const { endpoint, text, parentMessageId, conversationId } = req.body;
  if (text.length === 0) return handleError(res, { text: 'Prompt empty or too short' });
  if (endpoint !== 'gptPlugins') return handleError(res, { text: 'Illegal request' });

  // build user message --> handled by client

  // build endpoint option
  const endpointOption = {
    modelOptions: {
      model: req.body?.model ?? 'gpt-4',
      // chatGptLabel: req.body?.chatGptLabel ?? null,
      // promptPrefix: req.body?.promptPrefix ?? null,
      temperature: req.body?.temperature ?? 0,
      top_p: req.body?.top_p ?? 1,
      presence_penalty: req.body?.presence_penalty ?? 0,
      frequency_penalty: req.body?.frequency_penalty ?? 0
    },
    agentOptions: {
      model: 'gpt-3.5-turbo', // for agent model
      // model: 'gpt-4', // for agent model
      tools: req.body?.tools.map((tool) => tool.value) ?? [],
      temperature: req.body?.temperature ?? 0,
    },
  };

  const availableModels = getOpenAIModels();
  if (availableModels.find((model) => model === endpointOption.modelOptions.model) === undefined) {
    return handleError(res, { text: `Illegal request: model` });
  }

  // console.log('ask log', {
  //   text,
  //   conversationId,
  //   endpointOption
  // });

  console.log('ask log');
  console.dir({ text, conversationId, endpointOption }, { depth: null });

  // eslint-disable-next-line no-use-before-define
  return await ask({
    text,
    endpointOption,
    conversationId,
    parentMessageId,
    req,
    res
  });
});

const ask = async ({ text, endpointOption, parentMessageId = null, conversationId, req, res }) => {

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });
  let userMessage;
  let userMessageId;
  let responseMessageId;
  let lastSavedTimestamp = 0;

  const plugin = {
    loading: true,
    inputs: [],
    latest: null,
    outputs: null
  };

  const { tools } = endpointOption.agentOptions;
  delete endpointOption.agentOptions.tools;

  try {
    const getIds = (data) => {
      userMessage = data.userMessage;
      userMessageId = userMessage.messageId;
      responseMessageId = data.responseMessageId;
      if (!conversationId) {
        conversationId = data.conversationId;
      }
    };

    const { onProgress: progressCallback, sendIntermediateMessage } = createOnProgress({
      onProgress: ({ text: partialText }) => {
        const currentTimestamp = Date.now();

        if (plugin.loading === true) {
          plugin.loading = false;
        }

        if (currentTimestamp - lastSavedTimestamp > 500) {
          lastSavedTimestamp = currentTimestamp;
          saveMessage({
            messageId: responseMessageId,
            sender: 'ChatGPT',
            conversationId,
            parentMessageId: userMessageId,
            text: partialText,
            unfinished: true,
            cancelled: false,
            error: false
          });
        }
      },
    });

    const abortController = new AbortController();

    const chatAgent = new ChatAgent(process.env.OPENAI_KEY, {
      tools: validateTools(tools || []),
      debug: true,
      ...endpointOption,
    });

    const onAgentAction = (action) => {
      const formattedAction = formatAction(action);
      plugin.inputs.push(formattedAction);
      plugin.latest = formattedAction.plugin;
      saveMessage(userMessage);
      sendIntermediateMessage(res, { plugin });
      // console.log('PLUGIN ACTION', formattedAction);
    };
    
    const onChainEnd = (data) => {
      let { intermediateSteps: steps } = data;
      plugin.outputs = steps && steps[0].action ? formatSteps(steps) : 'An error occurred.';
      plugin.loading = false;
      saveMessage(userMessage);
      sendIntermediateMessage(res, { plugin });
      // console.log('CHAIN END', plugin.outputs);
    }

    let response = await chatAgent.sendMessage(text, {
      getIds,
      user: req?.session?.user?.username,
      parentMessageId,
      conversationId,
      onAgentAction,
      onChainEnd,
      onProgress: progressCallback.call(null, { res, text, plugin, parentMessageId: userMessageId }),
      abortController,
    });

    // console.log('CLIENT RESPONSE');
    // console.dir(response, { depth: null });
    response.plugin = { ...plugin, loading: false };
    await saveMessage(response);

    sendMessage(res, {
      title: await getConvoTitle(req?.session?.user?.username, conversationId),
      final: true,
      conversation: await getConvo(req?.session?.user?.username, conversationId),
      requestMessage: userMessage,
      responseMessage: response
    });
    res.end();

    if (parentMessageId == '00000000-0000-0000-0000-000000000000') {
      const title = await titleConvo({ text, response });
      await saveConvo(req?.session?.user?.username, {
        conversationId: conversationId,
        title
      });
    }
  } catch (error) {
    const errorMessage = {
      messageId: responseMessageId,
      sender: 'ChatGPT',
      conversationId,
      parentMessageId,
      unfinished: false,
      cancelled: false,
      error: true,
      text: error.message
    };
    await saveMessage(errorMessage);
    handleError(res, errorMessage);
  }
};

module.exports = router;
