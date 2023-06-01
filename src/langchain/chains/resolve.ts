import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts';
import { ChatMessageHistory } from 'langchain/memory';
import { HumanChatMessage, AIChatMessage } from 'langchain/schema';

interface LLMChainCallback {
    (token: string): void;
}

function createChat(
    callback: LLMChainCallback,
    modelName: Model = 'gpt-3.5-turbo',
    key?: string
) {
    return new ChatOpenAI({
        temperature: 0.1,
        streaming: true,
        modelName: modelName,
        openAIApiKey: key,
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
        'You are a helpful assistant.' +
            'You use internet search results to help the user.' +
            'Use the basic form of 1. summarizing what the user asked for. 2. explaining/demonstrating. 3. summarizing everything briefly. ' +
            'Respond in markdown format (including github flavored). ' +
            'Ensure sources are cited in-text and ensure all links are in md format. ' +
            'Ensure all code blocks and command examples are in md format ```code```, including the language. '
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

function createResolveChain(
    callback: LLMChainCallback,
    results: Result[],
    model?: Model,
    key?: string
) {
    const pastMessages: (HumanChatMessage | AIChatMessage)[] = [];
    for (const result of results) {
        pastMessages.push(new HumanChatMessage(result.query));
        pastMessages.push(new AIChatMessage(result.summary));
    }

    const chat = createChat(callback, model, key);
    const chatMemory = new BufferMemory({
        chatHistory: new ChatMessageHistory(pastMessages),
        returnMessages: true,
        memoryKey: 'history',
    });

    return new ConversationChain({
        memory: chatMemory,
        prompt: resolvePrompt,
        llm: chat,
    });
}

export { createResolveChain };
