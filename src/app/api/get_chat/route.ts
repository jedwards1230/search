import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

import { resultsToChatMessages } from '@/lib/langchain';
import supabase from '@/lib/supabase';
import buildChain from './chain';

export const runtime = 'edge';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        results,
        model,
        key,
    }: {
        query: string;
        results: Result[];
        model: Model;
        key?: string;
    } = res;

    if (!query) {
        return new Response('No query', {
            status: 400,
        });
    }

    if (!model) {
        return new Response('No model', {
            status: 400,
        });
    }

    const openAIApiKey = key || OPENAI_API_KEY;

    if (!openAIApiKey) {
        return new Response('No key', {
            status: 400,
        });
    }

    const vectorStore = new SupabaseVectorStore(
        new OpenAIEmbeddings({ openAIApiKey }),
        {
            client: supabase,
            tableName: 'documents',
        }
    );
    const context = await vectorStore.similaritySearch(query, 4);

    const input = `context: ${JSON.stringify(context)}\n\nQuery: ${query}`;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const callback = (token: string) => {
                const queue = encoder.encode(token);
                controller.enqueue(queue);
            };

            const pastMessages = resultsToChatMessages(results);

            const chain = buildChain(
                openAIApiKey,
                callback,
                model,
                pastMessages
            );
            try {
                await chain.call({ input });
            } catch (e) {
                console.error(e);
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream',
        },
    });
}
