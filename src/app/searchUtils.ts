import { readStream } from '@/lib/stream';

const timeout = (prom: Promise<any>, time: number | undefined) =>
    Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);

// get search results based on query
export const getResults = async (
    newQuery: string,
    results: Result[],
    openaiKey: string,
    googleApiKey: string,
    googleCSEId: string
) => {
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
            openaiKey,
            googleApiKey,
            googleCSEId,
        }),
    });
    const data = await res.json();

    const searchResults: SearchResult[] = data.searchResults;

    return searchResults;
};

export const analyzeSingleResult = async (
    searchResult: SearchResult,
    query: string,
    key: string
) => {
    const res = await fetch('/api/analyze_results', {
        method: 'POST',
        body: JSON.stringify({
            searchResult,
            query,
            key,
        }),
    });
    const data = await res.json();

    const analyzedResult: SearchResult = data.searchResult;

    return analyzedResult;
};

export const analyzeResults = async (
    searchResults: SearchResult[],
    query: string,
    key: string
) => {
    const analyzedResultsPromises: Promise<SearchResult>[] = searchResults.map(
        (result) => {
            // return timeout(analyzeSingleResult(result, query, key), 10000)
            return analyzeSingleResult(result, query, key);
        }
    );

    try {
        const analyzedResults: SearchResult[] = await Promise.all(
            analyzedResultsPromises
        );

        return analyzedResults.filter((result) => result !== undefined);
    } catch (err) {
        return [];
    }
};

// stream the summary of the results
export const summarizeResults = async (
    newQuery: string,
    searchResults: SearchResult[],
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
                query: newQuery,
                results,
                searchResults,
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
