import { NextResponse } from 'next/server';
import { searchGoogle } from '@/langchain/utils';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const runtime = 'edge';

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

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        history,
        openaiKey,
        googleApiKey,
        googleCSEId,
    }: {
        query: string;
        history: string;
        openaiKey: string;
        googleApiKey: string;
        googleCSEId: string;
    } = res;

    if (!query) {
        return NextResponse.json({
            error: 'No query provided',
        });
    }

    if (!openaiKey) {
        return NextResponse.json({
            error: 'No OpenAI key provided',
        });
    }

    if (!googleApiKey || !googleCSEId) {
        return NextResponse.json({
            error: 'No Google API key or CSE ID provided',
        });
    }

    try {
        const chat = new ChatOpenAI({
            temperature: 0,
            openAIApiKey: openaiKey,
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

        const searchQuery = await chain.call({
            input: `background info: ${history}\n\nUser Query: ${query}`,
        });

        const searchResults = await searchGoogle(
            searchQuery.response,
            googleApiKey,
            googleCSEId
        );

        return NextResponse.json({
            searchResults: searchResults.splice(0, 5),
        });
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
