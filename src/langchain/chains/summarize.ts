import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

interface LLMChainCallback {
    (token: string): void;
}

function createChat(callback: LLMChainCallback) {
    return new ChatOpenAI({
        temperature: 0,
        streaming: true,
        callbacks: [
            {
                handleLLMNewToken(token: string) {
                    callback(token);
                },
            },
        ],
    });
}

const summarizePrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You are an AI powered search engine and a helful assistant.' +
            'You use search results as the basis of your conversation.' +
            'Use the basic form of 1. summarizing what the user needs. 2. explaining/demonstrating. 3. summarizing everything briefly. ' +
            'You are encouraged to render tables and code blocks. ' +
            "Thoroughly answer the user's query based on the search results. " +
            'Respond in markdown format (including github flavored). ' +
            'Ensure sources are cited and ensure all links are in md format [Simple Title](Url). ' +
            'Ensure all code blocks and command examples are in md format ```code```, including the language. ' +
            'Search Results: {results}'
    ),
    HumanMessagePromptTemplate.fromTemplate('User query: {query}'),
]);

function createSummarizeChain(callback: LLMChainCallback) {
    const chat = createChat(callback);
    return new LLMChain({
        prompt: summarizePrompt,
        llm: chat,
    });
}

export { createSummarizeChain };
