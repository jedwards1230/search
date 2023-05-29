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
        "Thoroughly answer the user's query based on the search results. " +
            'Respond in markdown format. ' +
            'Ensure sources are cited with markdown links. ' +
            'Ensure all links are simplified with markdown links. '
    ),
    HumanMessagePromptTemplate.fromTemplate(
        'User query: {query}. Search Results: {results}'
    ),
]);

function createSummarizeChain(callback: LLMChainCallback) {
    const chat = createChat(callback);
    return new LLMChain({
        prompt: summarizePrompt,
        llm: chat,
    });
}

export { createSummarizeChain };
