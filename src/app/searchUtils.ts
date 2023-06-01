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

    const steps = JSON.parse(data.intermediateSteps);

    return steps;
};

// stream the summary of the results
export const summarizeResults = async (
    newQuery: string,
    searchResults: string,
    results: Result[],
    id: number,
    updateSummary: (id: number, summary: string) => void
) => {
    try {
        const response = await fetch('/api/summarize_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery, results, searchResults }),
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
