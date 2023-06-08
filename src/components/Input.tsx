'use client';

import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import clsx from 'clsx';

import { ChevronIcon, HideIcon, SearchIcon } from './icons';
import { useSearch } from '@/app/searchContext';
import RGB from './RGB';
import { motion } from 'framer-motion';

export default function Input({
    search,
    topLevel,
    close,
}: {
    search?: string | null;
    topLevel?: boolean;
    close?: () => void;
}) {
    const { loading, processQuery, reset } = useSearch();
    const [query, setQuery] = useState(search || '');
    const [context, setContext] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [quickSearch, setQuickSearch] = useState(false);

    useEffect(() => {
        if (search) setQuery(search);
    }, [search]);

    const submit = (update?: boolean) => {
        if (context === '') setShowContext(false);
        if (topLevel) reset();
        processQuery(query, context, update, quickSearch);
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit(topLevel);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(topLevel);
    };

    const queryRows = (query.match(/\n/g) || []).length + 1;
    const contextRows = (context.match(/\n/g) || []).length + 1;

    return (
        <>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.1,
                }}
                onSubmit={onSubmit}
                className="flex w-full flex-col items-center justify-center gap-2"
            >
                <div className="relative flex h-full w-full flex-col pb-2">
                    <div className="flex h-full w-full rounded-lg shadow-lg">
                        <motion.textarea
                            value={query}
                            autoFocus={true}
                            initial={{ padding: '0.5rem', opacity: 0 }}
                            whileFocus={{ padding: '1rem', opacity: 1 }}
                            animate={{ padding: '0.5rem', opacity: 1 }}
                            transition={{
                                duration: 0.2,
                            }}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDownHandler}
                            rows={queryRows > 15 ? 15 : queryRows}
                            className="w-full rounded-r-none rounded-tl-lg border border-b-0 border-neutral-400 p-2 shadow shadow-neutral-400 transition-colors focus:p-3 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700 dark:hover:bg-neutral-700 dark:disabled:bg-neutral-700"
                            placeholder="Ask anything..."
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowContext(!showContext);
                            }}
                            title="Hide Input"
                            className="flex cursor-pointer items-center border border-b-0 border-neutral-400 bg-white px-2 transition-all hover:bg-neutral-200 focus:border-2 focus:border-neutral-500 focus:outline-none focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                        >
                            <div
                                className={clsx([
                                    'h-6 w-6 text-center',
                                    showContext ? 'rotate-180' : '',
                                ])}
                            >
                                <ChevronIcon />
                            </div>
                        </button>
                        {close && !topLevel && (
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    close();
                                }}
                                title="Hide Input"
                                className="flex cursor-pointer items-center border border-b-0 border-neutral-400 bg-white px-2 transition-all hover:bg-neutral-200 focus:border-2 focus:border-neutral-500 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                            >
                                <HideIcon />
                            </div>
                        )}
                        <button
                            disabled={loading}
                            type="submit"
                            title="Search"
                            className="rounded-tr-lg border border-b-0 border-neutral-400 bg-white px-2 transition-all hover:bg-neutral-200 focus:border-2 focus:border-neutral-500 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <RGB />
                </div>
                {showContext && (
                    <motion.textarea
                        value={context}
                        autoFocus={true}
                        initial={{ padding: '0.5rem', opacity: 0 }}
                        whileFocus={{ padding: '1rem', opacity: 1 }}
                        animate={{ padding: '0.5rem', opacity: 1 }}
                        transition={{
                            duration: 0.2,
                        }}
                        onChange={(e) => setContext(e.target.value)}
                        onKeyDown={onKeyDownHandler}
                        rows={contextRows > 15 ? 15 : contextRows}
                        className="w-full rounded-lg border border-neutral-400 shadow-md shadow-neutral-400 transition-colors focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-800 dark:hover:bg-neutral-700 dark:disabled:bg-neutral-700/50"
                        placeholder="Add context..."
                    />
                )}
                <div className="flex w-full justify-end">
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={quickSearch}
                            onChange={(e) => setQuickSearch(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-neutral-300 after:bg-neutral-50 after:transition-all after:content-[''] hover:bg-neutral-300 peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-neutral-50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:peer-focus:ring-blue-800"></div>
                        <span className="ml-3 text-sm font-medium">
                            Quick Search
                        </span>
                    </label>
                </div>
            </motion.form>
        </>
    );
}
