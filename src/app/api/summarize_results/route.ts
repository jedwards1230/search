import { resultsToChatMessages } from '@/langchain/utils';
import supabase from '@/lib/supabase';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

export const runtime = 'edge';

const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You are a helpful assistant.' +
            `Todays date is ${new Date().toLocaleDateString()}.` +
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
        model,
        key,
    }: {
        query: string;
        results: Result[];
        model: Model;
        key: string;
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

    const vectorStore = new SupabaseVectorStore(
        new OpenAIEmbeddings({ openAIApiKey: key }),
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

            const chat = new ChatOpenAI({
                temperature: 0.2,
                streaming: true,
                modelName: model,
                openAIApiKey: key,
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
                prompt: prompt,
                llm: chat,
            });
            try {
                await resolveChain.call({ input });
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
