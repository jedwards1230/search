'use client';

import { useRouter } from 'next/navigation';
import React, {
    createContext,
    useCallback,
    useEffect,
    useReducer,
} from 'react';
import { analyzeResults, getResults, summarizeResults } from './searchUtils';

type State = {
    loading: boolean;
    results: Result[];
    model: Model;
    hideReferences: boolean;
    toggleReferences: () => void;
    processQuery: (newInput: string, updateUrl?: boolean) => void;
    reset: () => void;
    setModel: (model: Model) => void;
};

type Action =
    | { type: 'ADD_RESULT'; payload: Result }
    | { type: 'FINISH'; payload: number }
    | { type: 'RESET' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'TOGGLE_HIDE_REFERENCES' }
    | { type: 'UPDATE_MODEL'; payload: Model }
    | {
          type: 'UPDATE_SEARCH_RESULTS';
          payload: { id: number; searchResults: SearchResult[] };
      }
    | { type: 'UPDATE_SUMMARY'; payload: { id: number; summary: string } };

const initialState: State = {
    loading: false,
    results: [],
    model: 'gpt-3.5-turbo',
    hideReferences: true,
    toggleReferences: () => {
        console.log('toggleReferences not implemented');
    },
    processQuery: () => {
        console.log('processQuery not implemented');
    },
    reset: () => {
        console.log('reset not implemented');
    },
    setModel: () => {
        console.log('setModel not implemented');
    },
};

const SearchContext = createContext<State>(initialState);

export const useSearch = () => React.useContext(SearchContext);

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_RESULT':
            return { ...state, results: [...state.results, action.payload] };
        case 'FINISH':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload
                        ? {
                              ...result,
                              loading: false,
                              finished: true,
                          }
                        : result
                ),
            };
        case 'RESET':
            return initialState;
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'TOGGLE_HIDE_REFERENCES':
            return { ...state, hideReferences: !state.hideReferences };
        case 'UPDATE_MODEL':
            return {
                ...state,
                model: action.payload,
            };
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
                          }
                        : result
                ),
            };
        default:
            return state;
    }
};

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {});

    const processQuery = useCallback(
        async (newInput: string, updateUrl?: boolean) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
            dispatch({ type: 'SET_LOADING', payload: true });
            console.log('processQuery', state.model);

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

                const searchResultsWithContent = await analyzeResults(
                    searchResults
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
