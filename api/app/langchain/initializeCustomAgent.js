const CustomZeroShotAgent = require('./customZeroShotAgent');
const { prefix, suffix } = require('./instructions');
const { LLMChain } = require('langchain/chains');
const { BufferMemory, ChatMessageHistory } = require('langchain/memory');
const { ZeroShotAgent, AgentExecutor, ZeroShotAgentOutputParser } = require('langchain/agents');
const {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} = require('langchain/prompts');

const initializeCustomAgent = async ({ tools, model, pastMessages, currentDateString, ...rest }) => {
  const prompt = ZeroShotAgent.createPrompt(tools, {
    prefix: `Assistant is a large language model trained by OpenAI.\nKnowledge Cutoff: ${currentDateString}\nCurrent date: ${currentDateString}\n\n${prefix}`,
    suffix,
    inputVariables: ['input', 'chat_history', 'agent_scratchpad']
  });

  console.log('pastMessages', pastMessages);

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    new SystemMessagePromptTemplate(prompt),
    HumanMessagePromptTemplate.fromTemplate(`{chat_history}
    Query: {input}
    {agent_scratchpad}`)
  ]);

  let longestToolName = '';
  for (const tool of tools) {
    if (tool.name.length > longestToolName.length) {
      longestToolName = tool.name;
    }
  }

  class CustomOutputParser extends ZeroShotAgentOutputParser {
    constructor(fields) {
      super(fields);
    }

    async parse(text) {
      if (text.includes(this.finishToolName)) {
        const parts = text.split(this.finishToolName);
        const output = parts[parts.length - 1].trim();
        return {
          returnValues: { output },
          log: text
        };
      }
      // const match = /Action: (.*)\nAction Input: (.*)/s.exec(text); // old
      // const match = /Action: ([\s\S]*?)(?:\nAction Input: ([\s\S]*?))?$/.exec(text); //old
      const match = /(?:Action(?: 1)?:) ([\s\S]*?)(?:\n(?:Action Input(?: 1)?:) ([\s\S]*?))?$/.exec(text); //new
      if (!match) {
        const output = text.replace(/[tT]hought:/, '').split('\n')[0].trim();
        return {
          returnValues: { output: `Thought: ${output}` },
          log: text
        };
      }

      if (match && match[1].trim().length > longestToolName.length) {
        console.log('HIT PARSING ERROR', match);
        // const output = match[1].trim();
        // return {
        //   returnValues: { output },
        //   log: text
        // };
      }

      return {
        tool: match[1].trim(),
        toolInput: match[2].trim().replace(/^"+|"+$/g, '') ?? '',
        log: text
      };
    }
  }

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
    // returnMessages: true, // commenting this out retains memory
    memoryKey: 'chat_history',
    humanPrefix: 'User',
    aiPrefix: 'Assistant',
    inputKey: 'input',
    outputKey: 'output'
  });

  const llmChain = new LLMChain({
    prompt: chatPrompt,
    llm: model
  });

  const agent = new CustomZeroShotAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    allowedTools: tools.map((tool) => tool.name)
  });

  return AgentExecutor.fromAgentAndTools({ agent, tools, memory, ...rest });
};

module.exports = {
  initializeCustomAgent
};
