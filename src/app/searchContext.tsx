'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useReducer } from 'react';
import { getResults, summarizeResults } from './searchUtils';

type State = {
    /** Loading state */
    loading: boolean;
    /** Search results. Each result is an object with the query, summary, and references */
    results: Result[];
    /** Active model to analyze results */
    model: Model;
    processQuery: (newInput: string, updateUrl?: boolean) => void;
    reset: () => void;
};

type Action =
    | { type: 'RESET' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'ADD_RESULT'; payload: Result }
    | {
          type: 'UPDATE_SEARCH_RESULTS';
          payload: { id: number; searchResults: Observation[] };
      }
    | { type: 'UPDATE_SUMMARY'; payload: { id: number; summary: string } }
    | { type: 'UPDATE_MODEL'; payload: Model };

const initialState: State = {
    loading: false,
    results: [],
    model: 'gpt-3.5-turbo',
    processQuery: () => {
        console.log('processQuery not implemented');
    },
    reset: () => {
        console.log('reset not implemented');
    },
};

const SearchContext = createContext<State>(initialState);

export const useSearch = () => React.useContext(SearchContext);

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'RESET':
            return initialState;
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'ADD_RESULT':
            return { ...state, results: [...state.results, action.payload] };
        case 'UPDATE_SEARCH_RESULTS':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload.id
                        ? {
                              ...result,
                              references: action.payload.searchResults,
                          }
                        : result
                ),
            };
        case 'UPDATE_SUMMARY':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload.id
                        ? {
                              ...result,
                              summary: action.payload.summary,
                              finished: true,
                          }
                        : result
                ),
            };
        case 'UPDATE_MODEL':
            return {
                ...state,
                model: action.payload,
            };
        default:
            return state;
    }
};

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [state, dispatch] = useReducer(reducer, initialState);

    const processQuery = useCallback(
        async (newInput: string, updateUrl?: boolean) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
            dispatch({ type: 'SET_LOADING', payload: true });

            // update URL
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

            // fetch data and update result
            try {
                const searchResults = await getResults(newQuery, state.results);
                dispatch({
                    type: 'UPDATE_SEARCH_RESULTS',
                    payload: { id: id, searchResults },
                });

                const updateSummary = (id: number, summary: string) => {
                    dispatch({
                        type: 'UPDATE_SUMMARY',
                        payload: { id, summary },
                    });
                };

                await summarizeResults(
                    newQuery,
                    JSON.stringify(searchResults),
                    id,
                    updateSummary
                );
            } catch (error) {
                console.error(error);
                dispatch({
                    type: 'UPDATE_SUMMARY',
                    payload: { id: id, summary: 'Error' },
                });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.results, router, state.model]
    );

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    return (
        <SearchContext.Provider
            value={{
                loading: state.loading,
                results: state.results,
                model: state.model,
                processQuery,
                reset,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
