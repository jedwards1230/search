import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { WebBrowser } from 'langchain/tools/webbrowser';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;
    const searchResults: SearchResult[] = res.searchResults;

    try {
        const chat = new ChatOpenAI({ temperature: 0 });
        const embeddings = new OpenAIEmbeddings();

        const webBrowser = new WebBrowser({
            model: chat,
            embeddings: embeddings,
        });

        const contentPromises: Promise<SearchResult | null>[] =
            searchResults.map((result) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const content = await webBrowser._call(
                            `${result.link}, ${query}`
                        );
                        resolve({ ...result, content });
                    } catch (error) {
                        console.error(
                            `Error fetching content for ${result.link}:`,
                            error
                        );
                        reject(null);
                    }
                });
            });

        let searchResultsWithContent: SearchResult[] = [];
        do {
            const promiseIndices = contentPromises.map((_, i) => i);
            const res = await Promise.race(
                promiseIndices.map((i) => contentPromises[i])
            );

            if (res) {
                searchResultsWithContent.push(res);
            } else {
                const index = promiseIndices.find(
                    (i) => contentPromises[i] === res
                );
                if (index !== undefined) {
                    contentPromises.splice(index, 1);
                }
            }
        } while (
            contentPromises.length > 0 &&
            searchResultsWithContent.length < 3
        );

        return NextResponse.json({
            searchResults: searchResultsWithContent,
        });
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
