'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useReducer } from 'react';

import {
    analyzeSingleResult,
    getResults,
    summarizeResult,
    getChat,
} from '@/lib/search';
import reducer from './searchReducer';
import { initialState } from './configContext';
import { useConfig } from '@/app/configContext';
import { readStream } from '@/lib/stream';
import { checkKeys } from '@/lib/config';

const SearchContext = createContext<State>(initialState);

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const { config, updateConfig } = useConfig();
    if (!config || !updateConfig) throw new Error('No config or updateConfig');

    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        config,
        updateConfig,
    });
    const router = useRouter();

    const processQuery = useCallback(
        async (
            newInput: string,
            context?: string,
            updateUrl?: boolean,
            quickSearch?: boolean,
            idToUpdate?: number
        ) => {
            const newQuery = newInput.trim();
            if (newQuery === '') return;
            const newContext = context?.trim() || undefined;

            const keys = checkKeys(config);

            dispatch({ type: 'SET_LOADING', payload: true });
            const startTime = Date.now();

            if (updateUrl) {
                const url = new URL(window.location.href);
                url.searchParams.set('q', newQuery);
                router.replace(url.toString());
            }

            let id: number;
            if (idToUpdate !== undefined) {
                id = idToUpdate;
                dispatch({
                    type: 'REVERT_TO_RESULT',
                    payload: {
                        ...state.results[idToUpdate],
                        query: newQuery,
                        context: newContext || undefined,
                        model: config.model,
                        summary: '',
                        timeToComplete: undefined,
                    },
                });
            } else {
                id = state.results.length;
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
            }

            try {
                const finalQuery = newContext
                    ? `User provided context: ${newContext}\n\nUser query: ${newQuery}`
                    : newQuery;

                const searchResults = await getResults(
                    finalQuery,
                    state.results,
                    keys
                );

                if (searchResults.length === 0) {
                    throw new Error('No results found');
                }

                dispatch({
                    type: 'UPDATE_SEARCH_RESULTS',
                    payload: { id, searchResults, status: 'Scraping links' },
                });

                const analyzedResultsPromises = searchResults.map(
                    async (result) => {
                        const context = await analyzeSingleResult(
                            result,
                            finalQuery,
                            keys?.openaiApiKey,
                            quickSearch
                        );

                        if (config.summarizeReferences) {
                            const summarize = async () => {
                                const updateResult = (content: string) => {
                                    dispatch({
                                        type: 'UPDATE_SEARCH_REFERENCE',
                                        payload: {
                                            id,
                                            reference: {
                                                ...result,
                                                content,
                                            },
                                        },
                                    });
                                };

                                const stream = await summarizeResult(
                                    context,
                                    keys?.openaiApiKey
                                );
                                await readStream(stream, (token: string) =>
                                    updateResult(token)
                                );
                            };
                            summarize();
                        }

                        return context;
                    }
                );

                await Promise.all(analyzedResultsPromises);

                await getChat(
                    finalQuery,
                    state.results,
                    id,
                    config.model,
                    (id: number, summary: string) => {
                        dispatch({
                            type: 'UPDATE_SUMMARY',
                            payload: { id, summary },
                        });
                    },
                    keys?.openaiApiKey
                );

                dispatch({
                    type: 'FINISH',
                    payload: { id, time: Date.now() - startTime },
                });
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
                config,
                updateConfig,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export default SearchContext;
