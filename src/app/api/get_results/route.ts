import { NextResponse } from 'next/server';
import { translationChain } from '@/langchain/chains';
import { searchGoogle } from '@/langchain/utils';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;

    try {
        const searchQuery = await translationChain.call({ input: query });
        const searchResults = await searchGoogle(searchQuery.response);

        return NextResponse.json({
            output: '',
            intermediateSteps: searchResults,
        });
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
