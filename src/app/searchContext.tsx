'use client';

import { useSearchParams } from 'next/navigation';
import React, { createContext, useState } from 'react';

type SearchState = {
    loading: boolean;
    results: string;
    references: Observation[];
    started: boolean;
    query: string;
    setQuery: (query: string) => void;
    processQuery: (query: string) => void;
    reset: () => void;
};

const initialState: SearchState = {
    loading: false,
    results: '',
    references: [],
    started: false,
    query: '',
    setQuery: () => {
        console.log('setQuery not implemented');
    },
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
    const searchParams = useSearchParams();
    const search = searchParams.get('search');

    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(search || '');
    const [references, setReferences] = useState<Observation[]>([]);
    const [results, setResults] = useState('');

    const getResults = async (newQuery: string) => {
        const res = await fetch('/api/get_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery }),
        });
        const data = await res.json();

        setReferences(JSON.parse(data.intermediateSteps));

        return data;
    };

    const summarizeResults = async (newQuery: string, results: string) => {
        try {
            const res = await fetch('/api/summarize_results', {
                method: 'POST',
                body: JSON.stringify({ query: newQuery, results: results }),
            });

            const reader = res.body?.getReader();
            let accumulatedResponse = '';

            if (reader) {
                setLoading(false);
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        const decoded = new TextDecoder().decode(value);
                        accumulatedResponse += decoded;
                    }
                    setResults(accumulatedResponse);
                }
            }

            return accumulatedResponse;
        } catch (err) {
            console.error('Fetch error:', err);
            setResults('Error summarizing results');
        }
    };

    const processQuery = async (newQuery: string) => {
        setQuery(newQuery);
        setResults('');
        setStarted(true);
        setLoading(true);
        try {
            const data = await getResults(newQuery);
            await summarizeResults(newQuery, JSON.stringify(data));
        } catch (err) {
            console.error('Fetch error:', err);
            setLoading(false);
        }
    };

    const reset = () => {
        setResults('');
        setReferences([]);
        setLoading(false);
        setStarted(false);
        setQuery('');
    };

    return (
        <SearchContext.Provider
            value={{
                loading,
                results,
                references,
                started,
                query,
                setQuery,
                processQuery,
                reset,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
