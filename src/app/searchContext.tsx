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
        async (newInput: string, updateUrl?: boolean) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
            if (!config.openaiApiKey) {
                alert('Please add your OpenAI API key in the config');
                return;
            }

            if (!config.googleApiKey) {
                alert('Please add your Google API key in the config');
                return;
            }

            if (!config.googleCseApiKey) {
                alert('Please add your Google CSE API key in the config');
                return;
            }

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
                    model: config.model,
                    summary: '',
                    references: [],
                    finished: false,
                    status: 'Getting links',
                },
            });

            try {
                const searchResults = await getResults(
                    newQuery,
                    state.results,
                    config.openaiApiKey,
                    config.googleApiKey,
                    config.googleCseApiKey
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
                    newQuery,
                    config.openaiApiKey,
                    updateSearchResults
                );

                const updateSummary = (id: number, summary: string) => {
                    dispatch({
                        type: 'UPDATE_SUMMARY',
                        payload: { id, summary },
                    });
                };

                await summarizeResults(
                    newQuery,
                    searchResultsWithContent,
                    state.results,
                    id,
                    config.model,
                    config.openaiApiKey,
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
        [
            config.openaiApiKey,
            config.googleApiKey,
            config.googleCseApiKey,
            config.model,
            state.results,
            router,
        ]
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

export default SearchContext;
