import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain";
import { GoogleCustomSearch } from "langchain/tools";
import { ChatAgent, AgentExecutor } from "langchain/agents";

const chat = new ChatOpenAI({ temperature: 0 });
const translationPrompt = ChatPromptTemplate.fromPromptMessages([
	SystemMessagePromptTemplate.fromTemplate(
		"You translate messages, issues, and questions into 1 recommended search query for a search engine like google or bing. " +
			"Do not provide any information that can be used to identify the user. " +
			"Do not provide any text other than the search query. " +
			"Do not use any special characters unless necessary. Avoid qutoes."
	),
	HumanMessagePromptTemplate.fromTemplate("{message}"),
]);

export const chain = new LLMChain({
	prompt: translationPrompt,
	llm: chat,
});

const tools = [new GoogleCustomSearch()];
// Create the agent from the chat model and the tools
const agent = ChatAgent.fromLLMAndTools(
	new ChatOpenAI({ temperature: 0 }),
	tools
);
// Create an executor, which calls to the agent until an answer is found
export const executor = AgentExecutor.fromAgentAndTools({ agent, tools });
