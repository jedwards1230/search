import { resultsToChatMessages } from '@/langchain/utils';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const runtime = 'edge';

const summaryPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful assistant.' +
            'You use internet search results to inform your conversation with the user.' +
            'Provide responses as an in-depth explanation' +
            'Use the basic form of 1. summarizing what the user asked for. 2. explaining/demonstrating. 3. summarizing everything briefly. ' +
            'Respond in markdown format (including github flavored). ' +
            'Ensure all code blocks and command examples are in md format ```code```, including the language. '
    ),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

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
            if (!result) return '';
            return JSON.stringify({
                title: result.title,
                reference: `[${index}](${result.url})`,
                content: result.content ? result.content : result.snippet,
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

            const pastMessages = resultsToChatMessages(results);

            const chat = new ChatOpenAI({
                temperature: 0.1,
                streaming: true,
                modelName: model,
                callbacks: [
                    {
                        handleLLMNewToken(token: string) {
                            callback(token);
                        },
                    },
                ],
            });
            const chatMemory = new BufferMemory({
                chatHistory: new ChatMessageHistory(pastMessages),
                returnMessages: true,
                memoryKey: 'history',
            });

            const resolveChain = new ConversationChain({
                memory: chatMemory,
                prompt: summaryPrompt,
                llm: chat,
            });
            try {
                await resolveChain.call({ input });
            } catch (e) {
                console.log(e);
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
