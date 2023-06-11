import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { AIChatMessage, HumanChatMessage } from 'langchain/schema';

export default function buildChain(
    openAIApiKey: string,
    callback: (token: string) => void,
    model: string,
    pastMessages: (HumanChatMessage | AIChatMessage)[]
) {
    const prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'You are a helpful assistant. ' +
                `Todays date is ${new Date().toLocaleDateString()}. ` +
                'You use internet search results to inform your conversation with the user. ' +
                'Provide responses as an in-depth explanation. ' +
                'Respond in markdown format (including github flavored). ' +
                'Ensure all code blocks and command examples are in md format ```code```, including the language. '
        ),
        new MessagesPlaceholder('history'),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const llm = new ChatOpenAI({
        temperature: 0.2,
        streaming: true,
        modelName: model,
        openAIApiKey,
        callbacks: [
            {
                handleLLMNewToken(token: string) {
                    callback(token);
                },
            },
        ],
    });
    const memory = new BufferMemory({
        chatHistory: new ChatMessageHistory(pastMessages),
        returnMessages: true,
        memoryKey: 'history',
    });
    const chain = new ConversationChain({
        memory,
        prompt,
        llm,
    });

    return chain;
}
