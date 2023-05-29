import { createSummarizeChain } from '@/langchain/chains/summarize';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;
    const results = res.results;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const callback = (token: string) => {
                const queue = encoder.encode(token);
                controller.enqueue(queue);
            };

            const summarizeChain = createSummarizeChain(callback);
            await summarizeChain.call({ query, results });

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream',
        },
    });
}
