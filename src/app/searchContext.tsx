'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useReducer } from 'react';

import { analyzeResults, getResults, summarizeResults } from './searchUtils';
import reducer from './searchReducer';
import { initialState } from './config';
import { useConfig } from '@/app/config';

const SearchContext = createContext<State>(initialState);

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const { config } = useConfig();
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter();

    const processQuery = useCallback(
        async (newInput: string, context?: string, updateUrl?: boolean) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
            const newContext = context?.trim() || undefined;

            console.log({ newQuery, newContext });

            const { openaiApiKey, googleApiKey, googleCseApiKey } =
                checkKeys(config);

            dispatch({ type: 'SET_LOADING', payload: true });

            if (updateUrl) {
                const url = new URL(window.location.href);
                url.searchParams.set('q', newQuery);
                router.replace(url.toString());
            }

            const id = state.results.length;

            dispatch({
                type: 'ADD_RESULT',
                payload: {
                    id,
                    query: newQuery,
                    context: newContext || undefined,
                    model: config.model,
                    summary: '',
                    references: [],
                    finished: false,
                    status: 'Getting links',
                },
            });

            try {
                const finalQuery = newContext
                    ? `User provided context: ${newContext}\n\nUser query: ${newQuery}`
                    : newQuery;

                const searchResults = await getResults(
                    finalQuery,
                    state.results,
                    openaiApiKey,
                    googleApiKey,
                    googleCseApiKey
                );

                dispatch({
                    type: 'UPDATE_SEARCH_RESULTS',
                    payload: { id, searchResults, status: 'Scraping links' },
                });

                const updateSearchResults = (
                    id: number,
                    reference: SearchResult
                ) => {
                    dispatch({
                        type: 'UPDATE_SEARCH_REFERENCE',
                        payload: {
                            id,
                            reference,
                        },
                    });
                };

                const searchResultsWithContent = await analyzeResults(
                    id,
                    searchResults,
                    finalQuery,
                    openaiApiKey,
                    updateSearchResults
                );

                const updateSummary = (id: number, summary: string) => {
                    dispatch({
                        type: 'UPDATE_SUMMARY',
                        payload: { id, summary },
                    });
                };

                await summarizeResults(
                    finalQuery,
                    searchResultsWithContent,
                    state.results,
                    id,
                    config.model,
                    openaiApiKey,
                    updateSummary
                );

                dispatch({ type: 'FINISH', payload: id });
            } catch (error) {
                console.error(error);
                dispatch({
                    type: 'UPDATE_SUMMARY',
                    payload: { id: id, summary: `Error: ${error}` },
                });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [config, state.results, router]
    );

    const reset = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <SearchContext.Provider
            value={{
                loading: state.loading,
                results: state.results,
                processQuery,
                reset,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

function checkKeys(config: Config) {
    if (!config.openaiApiKey) {
        alert('Please add your OpenAI API key in the config');
        throw new Error('OpenAI API key not found');
    }

    if (!config.googleApiKey) {
        alert('Please add your Google API key in the config');
        throw new Error('Google API key not found');
    }

    if (!config.googleCseApiKey) {
        alert('Please add your Google CSE API key in the config');
        throw new Error('Google CSE API key not found');
    }

    return {
        openaiApiKey: config.openaiApiKey,
        googleApiKey: config.googleApiKey,
        googleCseApiKey: config.googleCseApiKey,
    };
}

export default SearchContext;
