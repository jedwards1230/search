import { NextResponse } from 'next/server';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import supabase from '@/lib/supabase';

export const runtime = 'edge';

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

        const embeddings = new OpenAIEmbeddings({ openAIApiKey: key });
        const vectorStore = new SupabaseVectorStore(embeddings, {
            client: supabase,
            tableName: 'documents',
        });

        const results = await vectorStore.similaritySearch(query, 3, {
            url: searchResult.url,
        });

        if (results && results.length > 0) {
            context = results.map((res) => res.pageContent).join('\n');
        } else {
            if (quickSearch) {
                context = searchResult.snippet;
                const doc = new Document({
                    pageContent: searchResult.snippet,
                    metadata: {
                        url: searchResult.url,
                        title: searchResult.title,
                        snippet: searchResult.snippet,
                    },
                });
                await vectorStore.addDocuments([doc]);
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

                await vectorStore.addDocuments(docs);

                const docStore = await MemoryVectorStore.fromDocuments(
                    docs,
                    embeddings
                );

                const results = await docStore.similaritySearch(query, 3);
                context = results.map((res) => res.pageContent).join('\n');
            }
        }

        return NextResponse.json({
            context,
        });
    } catch (e) {
        return NextResponse.json({
            error: e,
        });
    }
}
