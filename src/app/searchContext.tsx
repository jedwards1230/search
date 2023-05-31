'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useRef, useState } from 'react';

type SearchState = {
    loading: boolean;
    results: Result[];
    processQuery: (newInput: string) => void;
    reset: () => void;
};

const initialState: SearchState = {
    loading: false,
    results: [],
    processQuery: () => {
        console.log('processQuery not implemented');
    },
    reset: () => {
        console.log('reset not implemented');
    },
};

const SearchContext = createContext<SearchState>(initialState);

export const useSearch = () => React.useContext(SearchContext);

export function SearchContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    // default model to analyze results
    const [model, setModel] = useState<Model>('gpt-4');
    // loading state
    const [loading, setLoading] = useState(false);
    // search results. Each result is an object with the query, summary, and references
    const [results, setResults] = useState<Result[]>([]);
    // use for streaming the summary chunk by chunk
    const summaryRef = useRef('');
    // used to force a rerender when the summary is updated
    const [summaryUpdate, setSummaryUpdate] = useState(0);

    useEffect(() => {
        if (results.length > 0) {
            const updatedResults = [...results];
            updatedResults[results.length - 1].summary = summaryRef.current;
            setResults(updatedResults);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summaryUpdate]);

    // get search results based on query
    const getResults = async (newQuery: string) => {
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
    const summarizeResults = async (newQuery: string, results: string) => {
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

    // process the query, get the results, and stream the summary
    const processQuery = async (
        newInput: string
    ): Promise<boolean | undefined> => {
        const newQuery = newInput.trim();
        if (newQuery === '') return;

        const url = new URL(window.location.href);
        url.searchParams.set('q', newQuery);
        router.replace(url.toString());

        setLoading(true);
        const newResult = {
            id: results.length,
            query: newQuery,
            model,
            summary: '',
            references: [],
            finished: false,
        };

        setResults((results) => {
            const updatedResults = [...results];
            updatedResults.push(newResult);
            return updatedResults;
        });
        try {
            const data = await getResults(newQuery);
            newResult.references = data;

            setResults((results) => {
                const updatedResults = [...results];
                updatedResults[newResult.id] = newResult;
                return updatedResults;
            });

            await summarizeResults(newQuery, JSON.stringify(data));
            newResult.summary = summaryRef.current;
            newResult.finished = true;

            setResults((results) => {
                const updatedResults = [...results];
                updatedResults[newResult.id] = newResult;
                return updatedResults;
            });
            return true;
        } catch (err) {
            console.error('Fetch error:', err);
            setLoading(false);
            return false;
        }
    };

    const reset = () => {
        setLoading(false);
        setResults([]);
        setSummaryUpdate(0);
        summaryRef.current = '';
        router.replace('/');
    };

    return (
        <SearchContext.Provider
            value={{
                loading,
                results,
                processQuery,
                reset,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
