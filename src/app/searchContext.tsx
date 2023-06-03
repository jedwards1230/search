'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useReducer } from 'react';

import { analyzeResults, getResults, summarizeResults } from './searchUtils';
import reducer from './searchReducer';
import initialState from './initialState';

const SearchContext = createContext<State>(initialState);

export const useSearch = () => React.useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [state, dispatch] = useReducer(reducer, initialState);

    const processQuery = useCallback(
        async (newInput: string, updateUrl?: boolean) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
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
                    model: state.model,
                    summary: '',
                    references: [],
                    finished: false,
                },
            });

            try {
                const searchResults = await getResults(newQuery, state.results);
                dispatch({
                    type: 'UPDATE_SEARCH_RESULTS',
                    payload: { id: id, searchResults },
                });

                const searchResultsWithContent = await analyzeResults(
                    searchResults,
                    newQuery
                );
                dispatch({
                    type: 'UPDATE_SEARCH_RESULTS',
                    payload: {
                        id: id,
                        searchResults: searchResultsWithContent,
                    },
                });

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
                    state.model,
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
        [state.results, router, state.model]
    );

    const reset = () => {
        dispatch({ type: 'RESET' });
    };

    const toggleReferences = () => {
        dispatch({ type: 'TOGGLE_HIDE_REFERENCES' });
    };

    const setModel = (model: Model) => {
        dispatch({ type: 'UPDATE_MODEL', payload: model });
    };

    return (
        <SearchContext.Provider
            value={{
                loading: state.loading,
                results: state.results,
                model: state.model,
                hideReferences: state.hideReferences,
                toggleReferences,
                processQuery,
                reset,
                setModel,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
