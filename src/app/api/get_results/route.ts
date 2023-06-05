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
        if (query.length > 30) {
            const chat = new ChatOpenAI({
                temperature: 0,
                openAIApiKey: openaiKey,
            });
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
            const queryBuilderChain = new ConversationChain({
                memory: chatMemory,
                prompt: queryBuilderPrompt,
                llm: chat,
            });

            const searchQuery = await queryBuilderChain.call({
                input: `background info: ${history}\n\nUser Query: ${query}`,
            });

            const searchResults = await searchGoogle(
                searchQuery.response,
                googleApiKey,
                googleCSEId
            );

            return NextResponse.json({
                searchResults,
            });
        } else {
            const searchResults = await searchGoogle(
                query,
                googleApiKey,
                googleCSEId
            );

            return NextResponse.json({
                searchResults,
            });
        }
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
