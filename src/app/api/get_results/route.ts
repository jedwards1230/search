import { NextResponse } from 'next/server';
import { translationChain } from '@/langchain/chains';
import { searchGoogle } from '@/langchain/utils';
//import { searchExecutor, buildSearchPrompt } from '@/langchain/agents';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;

    const searchQuery = await translationChain.run(query);
    const searchResults = await searchGoogle(searchQuery);

    return NextResponse.json({
        output: '',
        intermediateSteps: searchResults,
    });

    // use langchain agent executor to resolve query
    /* const executor = await searchExecutor();
    const response = await executor.call({
        input: query,
    });
    const results = response.output;
    const intermediateSteps = response.intermediateSteps;

    return NextResponse.json({ results, intermediateSteps }); */
}
