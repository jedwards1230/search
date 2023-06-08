import { readStream } from '@/lib/stream';

// get search results based on query
export const getResults = async (
    newQuery: string,
    results: Result[],
    openAIApiKey: string,
    googleApiKey: string,
    googleCSEId: string
) => {
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
                openAIApiKey,
                googleApiKey,
                googleCSEId,
            }),
        });
        const data = await res.json();

        const searchResults: SearchResult[] = data.searchResults;

        return searchResults;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const analyzeSingleResult = async (
    searchResult: SearchResult,
    query: string,
    key: string,
    quickSearch?: boolean
) => {
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
};

export async function summarizeResult(context: string, key: string) {
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
export const summarizeResults = async (
    query: string,
    results: Result[],
    id: number,
    model: Model,
    key: string,
    updateSummary: (id: number, summary: string) => void
) => {
    try {
        const response = await fetch('/api/summarize_results', {
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
};
