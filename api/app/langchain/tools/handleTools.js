const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { ZapierToolKit } = require('langchain/agents');
const {
  SerpAPI,
  ZapierNLAWrapper
  // RequestsGetTool,
  // RequestsPostTool,
  // AIPluginTool
} = require('langchain/tools');
const { Calculator } = require('langchain/tools/calculator');
const { WebBrowser } = require('langchain/tools/webbrowser');
const GoogleSearchAPI = require('./googleSearch');
const OpenAICreateImage = require('./DALL-E');
const StableDiffusionAPI = require('./StableDiffusion');
const WolframAlphaAPI = require('./wolfram');
const availableTools = require('./manifest.json');
const { getUserPluginAuthValue } = require('../../../server/services/PluginService');

const validateTools = async (user, tools = []) => {
  try {
    const validToolsSet = new Set(tools);
    const availableToolsToValidate = availableTools.filter((tool) =>
      validToolsSet.has(tool.pluginKey)
    );

    const validateCredentials = async (authField, toolName) => {
      const adminAuth = process.env[authField];
      if (adminAuth && adminAuth.length > 0) {
        return;
      }

      const userAuth = await getUserPluginAuthValue(user, authField);
      if (userAuth && userAuth.length > 0) {
        return;
      }
      validToolsSet.delete(toolName);
    };

    for (const tool of availableToolsToValidate) {
      if (!tool.authConfig || tool.authConfig.length === 0) {
        continue;
      }

      for (const auth of tool.authConfig) {
        await validateCredentials(auth.authField, tool.pluginKey);
      }
    }

    return Array.from(validToolsSet.values());
  } catch (err) {
    console.log('There was a problem validating tools', err);
    throw new Error(err);
  }
};

const loadTools = async ({ user, model, tools = [] }) => {
  const availableTools = {
    calculator: () => new Calculator(),
    google: async () => {
      let cx = process.env.GOOGLE_CSE_ID;
      let apiKey = process.env.GOOGLE_API_KEY;
      if (!cx || !apiKey) {
        cx = await getUserPluginAuthValue(user, 'GOOGLE_CSE_ID');
        apiKey = await getUserPluginAuthValue(user, 'GOOGLE_API_KEY');
      }
      return new GoogleSearchAPI({ cx, apiKey });
    },
    browser: async () => {
      let openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        openAIApiKey = await getUserPluginAuthValue(user, 'OPENAI_API_KEY');
      }
      return new WebBrowser({ model, embeddings: new OpenAIEmbeddings({ openAIApiKey }) });
    },
    serpapi: async () => {
      let apiKey = process.env.SERPAPI_API_KEY;
      if (!apiKey) {
        apiKey = await getUserPluginAuthValue(user, 'SERPAPI_API_KEY');
      }
      return new SerpAPI(apiKey, {
        location: 'Austin,Texas,United States',
        hl: 'en',
        gl: 'us'
      });
    },
    zapier: async () => {
      let apiKey = process.env.ZAPIER_NLA_API_KEY;
      if (!apiKey) {
        apiKey = await getUserPluginAuthValue(user, 'ZAPIER_NLA_API_KEY');
      }
      const zapier = new ZapierNLAWrapper({ apiKey });

      return ZapierToolKit.fromZapierNLAWrapper(zapier);
    },
    'dall-e': async () => {
      let apiKey = process.env.DALLE_API_KEY;
      if (!apiKey) {
        apiKey = await getUserPluginAuthValue(user, 'DALLE_API_KEY');
      }
      return new OpenAICreateImage({ apiKey });
    },
    'stable-diffusion': () => new StableDiffusionAPI(),
    wolfram: async () => {
      let apiKey = process.env.WOLFRAM_APP_ID;
      if (!apiKey) {
        apiKey = await getUserPluginAuthValue(user, 'WOLFRAM_APP_ID');
      }
      return new WolframAlphaAPI({ apiKey });
    }
  };

  const requestedTools = {};

  for (const tool of tools) {
    if (availableTools[tool]) {
      requestedTools[tool] = availableTools[tool];
    }
  }

  return requestedTools;
};

module.exports = {
  validateTools,
  loadTools
};
