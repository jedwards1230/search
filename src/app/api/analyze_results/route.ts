import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { WebBrowser } from 'langchain/tools/webbrowser';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;
    const searchResult: SearchResult = res.searchResult;

    try {
        const chat = new ChatOpenAI({ temperature: 0 });
        const embeddings = new OpenAIEmbeddings();

        const webBrowser = new WebBrowser({
            model: chat,
            embeddings: embeddings,
        });

        const content = await webBrowser._call(
            `${searchResult.link}, ${query}`
        );
        const searchResultWithContent: SearchResult = {
            ...searchResult,
            content,
        };

        return NextResponse.json({
            searchResult: searchResultWithContent,
        });
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
