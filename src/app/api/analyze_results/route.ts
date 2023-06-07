import { NextResponse } from 'next/server';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { ConversationChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIChat } from 'langchain/llms/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export const runtime = 'edge';

const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You generate a summary based on the provided data in order to satisfy the query.'
    ),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        searchResult,
        key,
        quickSearch,
    }: {
        query: string;
        searchResult: SearchResult;
        key: string;
        quickSearch?: boolean;
    } = res;

    try {
        let context: string;

        if (quickSearch) {
            context = searchResult.snippet;
        } else {
            const loader = new CheerioWebBaseLoader(searchResult.url);
            const pages = await loader.load();

            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 2000,
                chunkOverlap: 200,
            });
            const texts = await textSplitter.splitText(
                pages.map((doc) => doc.pageContent).join(' ')
            );

            const docs: Document[] = texts.map(
                (pageContent) =>
                    new Document({
                        pageContent,
                        metadata: {
                            url: searchResult.url,
                            title: searchResult.title,
                            snippet: searchResult.snippet,
                        },
                    })
            );

            const vectorStore = await MemoryVectorStore.fromDocuments(
                docs,
                new OpenAIEmbeddings({ openAIApiKey: key })
            );
            const results = await vectorStore.similaritySearch(query, 4);
            context = results.map((res) => res.pageContent).join('\n');
        }

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                const callback = (token: string) => {
                    const queue = encoder.encode(token);
                    controller.enqueue(queue);
                };

                const summaryChain = new ConversationChain({
                    prompt,
                    llm: new OpenAIChat({
                        temperature: 0,
                        openAIApiKey: key,
                        streaming: true,
                        callbacks: [
                            {
                                handleLLMNewToken(token: string) {
                                    callback(token);
                                },
                                handleLLMEnd() {
                                    const endEvent = encoder.encode('LLM_END');
                                    controller.enqueue(endEvent);
                                },
                            },
                        ],
                    }),
                });

                await summaryChain.call({
                    input: `data: ${context}\n\nquery: ${query}`,
                });

                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'content-type': 'text/event-stream',
            },
        });
    } catch (e) {
        return NextResponse.json({
            error: e,
        });
    }
}
