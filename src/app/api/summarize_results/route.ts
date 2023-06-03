import { createResolveChain } from '@/langchain/chains';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        results,
        searchResults,
        model,
    }: {
        query: string;
        results: Result[];
        searchResults: SearchResult[];
        model: Model;
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

    const input = `context: ${JSON.stringify(
        searchResults.map((result, index) => {
            if (!result || !result.content) {
                return '';
            }
            return JSON.stringify({
                title: result.title,
                reference: `[${index}](${result.url})`,
                content: result.content,
            });
        })
    )}\n\nQuery: ${query}`;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const callback = (token: string) => {
                const queue = encoder.encode(token);
                controller.enqueue(queue);
            };

            const resolveChain = createResolveChain(callback, results, model);
            await resolveChain.call({ input });

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream',
        },
    });
}
