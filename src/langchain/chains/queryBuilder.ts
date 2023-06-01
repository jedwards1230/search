import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts';

export default function createQueryBuilderChain(model?: Model) {
    const chat = new ChatOpenAI({ temperature: 0, modelName: model });
    const queryBuilderPrompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'You translate messages, issues, and questions into 1 recommended search query for a search engine like google or bing. ' +
                'Do not provide any information that can be used to identify the user. ' +
                'Do not provide any text other than the search query. ' +
                'Do not use any special characters unless necessary. Avoid quotes.'
        ),
        new MessagesPlaceholder('queryBuilderHistory'),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chatMemory = new BufferMemory({
        returnMessages: true,
        memoryKey: 'queryBuilderHistory',
    });
    return new ConversationChain({
        memory: chatMemory,
        prompt: queryBuilderPrompt,
        llm: chat,
    });
}
