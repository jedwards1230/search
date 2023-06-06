import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export default function buildChain(openAIApiKey: string) {
    const prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'You produce search queries based on user text. ' +
                'Reduce the user input into 1 recommended search query for a search engine like google or bing. ' +
                '- If the user input is already a good search query, simply respond with that as if it were your own answer. ' +
                '- Do not provide any information that can be used to identify the user. ' +
                '- Do not provide any text other than the search query. ' +
                '- Do not use any special characters unless necessary. Avoid quotes. ' +
                '- Only output the plaintext query suggestion.'
        ),
        new MessagesPlaceholder('queryBuilderHistory'),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const chat = new ChatOpenAI({
        temperature: 0,
        openAIApiKey,
    });
    const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: 'queryBuilderHistory',
    });
    const chain = new ConversationChain({
        memory,
        prompt,
        llm: chat,
    });

    return chain;
}
