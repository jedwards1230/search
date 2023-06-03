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

export const analyzeResults = async (searchResults: SearchResult[]) => {
    const res = await fetch('/api/analyze_results', {
        method: 'POST',
        body: JSON.stringify({
            searchResults,
        }),
    });
    const data = await res.json();

    const analyzedResults: SearchResult[] = data.searchResults;

    return analyzedResults;
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

        const reader = response.body.getReader();
        let accumulatedResponse = '';

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    const decoded = new TextDecoder().decode(value);
                    accumulatedResponse += decoded;
                    updateSummary(id, accumulatedResponse);
                }
            }
        }
    } catch (err) {
        console.error('Fetch error:', err);
        updateSummary(id, `Error summarizing results: ${err}`);
    }
};
