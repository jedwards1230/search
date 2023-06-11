import { readStream } from '@/lib/stream';

// get search results based on query
export async function getResults(
    newQuery: string,
    results: Result[],
    keys?: Keys
) {
    const history = results.map((result) => {
        return {
            query: result.query,
            summary: result.summary,
        };
    });
    try {
        const res = await fetch('/api/get_results', {
            method: 'POST',
            body: JSON.stringify({
                query: newQuery,
                history: JSON.stringify(history),
                keys,
            }),
        });
        const data = await res.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const searchResults: SearchResult[] = data.searchResults;

        return searchResults;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function analyzeSingleResult(
    searchResult: SearchResult,
    query: string,
    key?: string | null,
    quickSearch?: boolean
) {
    const res = await fetch('/api/analyze_result', {
        method: 'POST',
        body: JSON.stringify({
            searchResult,
            query,
            key,
            quickSearch,
        }),
    });
    if (!res.ok) {
        throw new Error('Analyze result failed');
    }
    const context: string = await res.json();

    return context;
}

export async function summarizeResult(context: string, key?: string | null) {
    const res = await fetch('/api/summarize_result', {
        method: 'POST',
        body: JSON.stringify({
            context,
            key,
        }),
    });

    if (!res.body) {
        throw new Error('No response body');
    }

    return res.body;
}

// stream the summary of the results
export async function summarizeResults(
    query: string,
    results: Result[],
    id: number,
    model: Model,
    updateSummary: (id: number, summary: string) => void,
    key?: string | null
) {
    try {
        const response = await fetch('/api/get_chat', {
            method: 'POST',
            body: JSON.stringify({
                query,
                results,
                key,
                model,
            }),
        });

        if (!response.body) {
            throw new Error('No response body');
        }

        readStream(response.body, (chunk: string) => updateSummary(id, chunk));
    } catch (err) {
        console.error('Fetch error:', err);
        updateSummary(id, `Error summarizing results: ${err}`);
    }
}

export async function searchGoogle(
    input: string,
    googleApiKey: string,
    googleCSEId: string
) {
    const apiKey = process.env.GOOGLE_API_KEY || googleApiKey;
    const CSEId = process.env.GOOGLE_CSE_ID || googleCSEId;

    if (!apiKey || !CSEId) {
        throw new Error(
            'Missing GOOGLE_API_KEY or GOOGLE_CSE_ID environment variables'
        );
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('cx', CSEId);
    url.searchParams.set('q', input);
    url.searchParams.set('start', '1');

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(
            `Got ${res.status} error from Google custom search: ${res.statusText}`
        );
    }

    const json = await res.json();

    const results: SearchResult[] =
        json?.items?.map(
            (item: { title?: string; link?: string; snippet?: string }) => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet,
            })
        ) ?? [];
    return results;
}
