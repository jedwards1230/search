'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useRef, useState } from 'react';

type SearchState = {
    loading: boolean;
    results: Result[];
    started: boolean;
    processQuery: (newInput: string) => void;
    reset: () => void;
};

const initialState: SearchState = {
    loading: false,
    results: [],
    started: false,
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

    const summaryRef = useRef('');
    const [model, setModel] = useState<Model>('gpt-3.5-turbo');

    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Result[]>([]);
    const [summaryUpdate, setSummaryUpdate] = useState(0);

    useEffect(() => {
        if (results.length > 0) {
            const updatedResults = [...results];
            updatedResults[results.length - 1].summary = summaryRef.current;
            setResults(updatedResults);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summaryUpdate]);

    const getResults = async (newQuery: string) => {
        const res = await fetch('/api/get_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery }),
        });
        const data = await res.json();

        const steps = JSON.parse(data.intermediateSteps);

        return steps;
    };

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

    const processQuery = async (
        newInput: string
    ): Promise<boolean | undefined> => {
        const newQuery = newInput.trim();
        if (newQuery === '') return;

        const url = new URL(window.location.href);
        url.searchParams.set('q', newQuery);
        router.replace(url.toString());

        setStarted(true);
        setLoading(true);
        try {
            const newResult = {
                id: results.length,
                query: newQuery,
                model,
                summary: '',
                references: [],
                finished: false,
            };
            const data = await getResults(newQuery);
            newResult.references = data;

            setResults((results) => {
                const updatedResults = [...results];
                updatedResults.push(newResult);
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
        setResults([]);
        setLoading(false);
        summaryRef.current = '';
        setStarted(false);
        setSummaryUpdate(0);
        router.replace('/');
    };

    return (
        <SearchContext.Provider
            value={{
                loading,
                results,
                started,
                processQuery,
                reset,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
