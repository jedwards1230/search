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

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;
    const searchResult: SearchResult = res.searchResult;

    try {
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

        const chat = new OpenAIChat({ temperature: 0 });
        const embeddings = new OpenAIEmbeddings();
        const vectorStore = await MemoryVectorStore.fromDocuments(
            docs,
            embeddings
        );
        const results = await vectorStore.similaritySearch(query, 4);
        const context = results.map((res) => res.pageContent).join('\n');

        const resolvePrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                'You generate a summary based on the provided data in order to satisfy the query.'
            ),
            HumanMessagePromptTemplate.fromTemplate('{input}'),
        ]);

        const summaryChain = new ConversationChain({
            prompt: resolvePrompt,
            llm: chat,
        });
        const content = await summaryChain.call({
            input: `data: ${context}\n\nquery: ${query}`,
        });

        const searchResultWithContent: SearchResult = {
            ...searchResult,
            content: content.response,
        };

        return NextResponse.json({
            searchResult: searchResultWithContent,
        });
    } catch (e) {
        return NextResponse.json({
            error: e,
        });
    }
}
