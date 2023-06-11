import { ConversationChain } from 'langchain/chains';
import { OpenAIChat } from 'langchain/llms/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const runtime = 'edge';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You generate a summary based on the provided data.\n' +
            '- Do NOT refer to the user your prompt.\n' +
            "- Do NOT use phrases like 'the provided data..' or 'the data says..' or 'the data includes.." +
            '- Simply out a brief summary that includes all the information in the data.\n'
    ),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

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

            const chain = new ConversationChain({
                prompt,
                llm: new OpenAIChat({
                    temperature: 0,
                    openAIApiKey,
                    streaming: true,
                    callbacks: [
                        {
                            handleLLMNewToken(token: string) {
                                callback(token);
                            },
                        },
                    ],
                }),
            });

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
