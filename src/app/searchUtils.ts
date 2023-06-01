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
    results: string,
    summaryRef: React.MutableRefObject<string>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSummaryUpdate: React.Dispatch<React.SetStateAction<number>>
) => {
    try {
        const response = await fetch('/api/summarize_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery, results: results }),
        });

        const reader = response.body?.getReader();
        let accumulatedResponse = '';

        if (reader) {
            setLoading(false);
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    const decoded = new TextDecoder().decode(value);
                    accumulatedResponse += decoded;
                    summaryRef.current = accumulatedResponse;
                    setSummaryUpdate((prev) => prev + 1);
                }
            }
        }
    } catch (err) {
        console.error('Fetch error:', err);
        summaryRef.current = 'Error summarizing results';
    }
};
