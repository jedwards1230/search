'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { getResults, summarizeResults } from './searchUtils';

type SearchState = {
    loading: boolean;
    results: Result[];
    processQuery: (newInput: string, updateUrl?: boolean) => void;
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

    // process the query, get the results, and stream the summary
    const processQuery = async (
        newInput: string,
        updateUrl?: boolean
    ): Promise<boolean | undefined> => {
        const newQuery = newInput.trim();
        if (newQuery === '') return;
        setLoading(true);

        // update URL
        if (updateUrl) {
            const url = new URL(window.location.href);
            url.searchParams.set('q', newQuery);
            router.replace(url.toString());
        }

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
            const data = await getResults(newQuery, results);
            newResult.references = data;

            setResults((results) => {
                const updatedResults = [...results];
                updatedResults[newResult.id] = newResult;
                return updatedResults;
            });

            await summarizeResults(
                newQuery,
                JSON.stringify(data),
                summaryRef,
                setLoading,
                setSummaryUpdate
            );

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
