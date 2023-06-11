import buildChain from './chain';

export const runtime = 'edge';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
    const res = await request.json();
    const {
        context,
        key,
    }: {
        context: string;
        key?: string;
    } = res;

    if (!context) {
        return new Response('No context', {
            status: 400,
        });
    }

    const openAIApiKey = key || OPENAI_API_KEY;

    if (!openAIApiKey) {
        return new Response('No key', {
            status: 400,
        });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const callback = (token: string) => {
                const queue = encoder.encode(token);
                controller.enqueue(queue);
            };

            const chain = buildChain(openAIApiKey, callback);

            await chain.call({
                input: JSON.stringify(context),
            });

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream',
        },
    });
}
