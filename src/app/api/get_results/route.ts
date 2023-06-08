import { NextResponse } from 'next/server';

import { searchGoogle } from '@/lib/search';
import supabase from '@/lib/supabase';
import buildChain from './buildChain';

export const runtime = 'edge';

export async function POST(request: Request) {
    const res = await request.json();
    const {
        query,
        history,
        openAIApiKey,
        googleApiKey,
        googleCSEId,
    }: {
        query: string;
        history: string;
        openAIApiKey: string;
        googleApiKey: string;
        googleCSEId: string;
    } = res;

    if (!query) {
        return NextResponse.json({
            error: 'No query provided',
        });
    }

    if (!openAIApiKey) {
        return NextResponse.json({
            error: 'No OpenAI key provided',
        });
    }

    if (!googleApiKey || !googleCSEId) {
        return NextResponse.json({
            error: 'No Google API key or CSE ID provided',
        });
    }

    // Check if the input query has a stored response in the Supabase table
    const { data, error } = await supabase
        .from('queries')
        .select('generated_query')
        .eq('input_query', query);

    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message });
    }

    let generatedQuery;

    if (data && data.length > 0) {
        // If the response exists in the table, use the stored generated query
        generatedQuery = data[0].generated_query;
    } else {
        // If the response doesn't exist, call the chain to generate the query
        try {
            const chain = buildChain(openAIApiKey);
            const searchQuery = await chain.call({
                input: `background info: ${history}\n\nUser Query: ${query}`,
            });

            generatedQuery = searchQuery.response;

            // Insert the input query and generated query into the Supabase table
            const { data, error } = await supabase
                .from('queries')
                .insert([
                    { input_query: query, generated_query: generatedQuery },
                ]);

            if (error) {
                console.error('Supabase error:', error);
                return NextResponse.json({ error: error.message });
            }
        } catch (e) {
            console.error('error: ', e);
            return NextResponse.json({
                error: e,
            });
        }
    }

    // strip any quotes from the generated query
    generatedQuery = generatedQuery.replace(/"/g, '');

    try {
        const searchResults = await searchGoogle(
            generatedQuery,
            googleApiKey,
            googleCSEId
        );

        return NextResponse.json({
            searchResults: searchResults.splice(0, 5),
        });
    } catch (e) {
        console.error('error: ', e);
        return NextResponse.json({
            error: e,
        });
    }
}
