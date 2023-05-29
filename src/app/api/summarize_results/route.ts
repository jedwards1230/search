import { NextResponse } from 'next/server';
import { summarizeChain } from '@/langchain/chains';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const query = res.query;
    const results = res.results;

    const summary = await summarizeChain.call({
        query,
        results,
    });

    return NextResponse.json({ summary: summary.text });
}
