'use client';

import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import clsx from 'clsx';

import { ChevronIcon, HideIcon, SearchIcon } from './icons';
import { useSearch } from '@/app/searchContext';
import RGB from './RGB';

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
        submit();
    };

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="flex w-full flex-col items-center justify-center gap-2"
            >
                <div className="relative flex h-full w-full flex-col pb-2">
                    <div className="flex h-full w-full">
                        <TextareaAutosize
                            value={query}
                            autoFocus={true}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDownHandler}
                            rows={1}
                            maxRows={25}
                            className="h-full w-full rounded-r-none border border-neutral-500 p-4 shadow transition-colors focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:disabled:bg-neutral-700/50"
                            placeholder="Ask anything..."
                        />
                        {topLevel && (
                            <div
                                onClick={() => setShowContext(!showContext)}
                                title="Hide Input"
                                className="flex cursor-pointer items-center border border-neutral-500 bg-white stroke-blue-500 px-2 transition-all hover:bg-neutral-100 hover:stroke-2 dark:border-none dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                            >
                                <div
                                    className={clsx([
                                        'h-6 w-6 text-center',
                                        showContext ? 'rotate-180' : '',
                                    ])}
                                >
                                    <ChevronIcon />
                                </div>
                            </div>
                        )}
                        {close && !topLevel && (
                            <div
                                onClick={close}
                                title="Hide Input"
                                className="flex cursor-pointer items-center border border-neutral-500 bg-white stroke-blue-500 px-2 transition-all hover:bg-neutral-200 hover:stroke-2 dark:border-none dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                            >
                                <HideIcon />
                            </div>
                        )}
                        <button
                            disabled={loading}
                            type="submit"
                            title="Search"
                            className="border border-neutral-500 bg-white stroke-blue-500 px-2 transition-all hover:bg-neutral-200 hover:stroke-2 dark:border-none dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <RGB />
                </div>
                {showContext && (
                    <TextareaAutosize
                        value={context}
                        autoFocus={true}
                        onChange={(e) => setContext(e.target.value)}
                        onKeyDown={onKeyDownHandler}
                        rows={1}
                        maxRows={25}
                        className="h-full w-full rounded-r-none border border-neutral-500 p-4 shadow transition-colors focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:disabled:bg-neutral-700/50"
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
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Quick Search
                        </span>
                    </label>
                </div>
            </form>
        </>
    );
}
