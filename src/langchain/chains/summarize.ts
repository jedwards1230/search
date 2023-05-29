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
        'You are an AI powered search engine and a helful assistant. You use search results as the basis of your conversation.' +
            "Thoroughly answer the user's query based on the search results. " +
            'Provided step-by-step instructions and examples to help teach the user. ' +
            'Respond in markdown format (including github flavored). ' +
            'Ensure sources are cited and ensure all links are in md format [Simple Title](Url). '
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
