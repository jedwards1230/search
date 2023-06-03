import { createResolveChain } from '@/langchain/chains';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        results,
        encryptedKey,
        searchResults,
    }: {
        query: string;
        results: Result[];
        encryptedKey: string;
        searchResults: SearchResult[];
    } = res;

    const input = `context: ${JSON.stringify(
        searchResults.map((result, index) => {
            if (!result.content) return;
            return {
                title: result.title,
                reference: `[${index}](${result.link})`,
                content: result.content,
            };
        })
    )}\n\nQuery: ${query}`;

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const callback = (token: string) => {
                const queue = encoder.encode(token);
                controller.enqueue(queue);
            };

            let key;

            const resolveChain = createResolveChain(
                callback,
                results,
                'gpt-3.5-turbo',
                key
            );
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
