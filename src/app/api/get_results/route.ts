import { NextResponse } from 'next/server';
import { searchExecutor } from '@/langchain/agents';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;

    const executor = await searchExecutor();
    const response = await executor.call({ input: query });
    const results = response.output;
    const intermediateSteps = response.intermediateSteps;

    return NextResponse.json({ results, intermediateSteps });
}
