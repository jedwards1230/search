import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
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

const resolvePrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You are an AI powered search engine and a helful assistant.' +
            'You use search results as the basis of your conversation.' +
            'Use the basic form of 1. summarizing what the user needs. 2. explaining/demonstrating. 3. summarizing everything briefly. ' +
            'You are encouraged to render tables and code blocks. ' +
            "Thoroughly answer the user's query based on the search results. " +
            'Respond in markdown format (including github flavored). ' +
            'Ensure sources are cited and ensure all links are in md format [Simple Title](Url). ' +
            'Ensure all code blocks and command examples are in md format ```code```, including the language. '
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

export const chatMemory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
});

function createResolveChain(callback: LLMChainCallback) {
    const chat = createChat(callback);
    return new ConversationChain({
        memory: chatMemory,
        prompt: resolvePrompt,
        llm: chat,
    });
}

export { createResolveChain };
