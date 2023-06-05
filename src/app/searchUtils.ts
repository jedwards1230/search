import { readStream } from '@/lib/stream';

// get search results based on query
export const getResults = async (newQuery: string, results: Result[]) => {
    const history = results.map((result) => {
        return {
            query: result.query,
            summary: result.summary,
        };
    });
    const res = await fetch('/api/get_results', {
        method: 'POST',
        body: JSON.stringify({
            query: newQuery,
            history: JSON.stringify(history),
        }),
    });
    const data = await res.json();

    const searchResults: SearchResult[] = data.searchResults;

    return searchResults;
};

export const analyzeSingleResult = async (
    searchResult: SearchResult,
    query: string
) => {
    const res = await fetch('/api/analyze_results', {
        method: 'POST',
        body: JSON.stringify({
            searchResult,
            query,
        }),
    });
    const data = await res.json();

    const analyzedResult: SearchResult = data.searchResult;

    return analyzedResult;
};

export const analyzeResults = async (
    searchResults: SearchResult[],
    query: string
) => {
    const analyzedResultsPromises = searchResults.map((result) =>
        analyzeSingleResult(result, query)
    );

    const analyzedResults: SearchResult[] = await Promise.all(
        analyzedResultsPromises
    );

    return analyzedResults.filter((result) => !result);
};

// stream the summary of the results
export const summarizeResults = async (
    newQuery: string,
    searchResults: SearchResult[],
    results: Result[],
    id: number,
    model: Model,
    updateSummary: (id: number, summary: string) => void
) => {
    try {
        const key = 'sk-1234******';
        const encryptedKey = key; // encrypt this
        const response = await fetch('/api/summarize_results', {
            method: 'POST',
            body: JSON.stringify({
                query: newQuery,
                results,
                searchResults,
                encryptedKey,
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
