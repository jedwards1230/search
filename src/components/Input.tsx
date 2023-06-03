'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import SearchIcon from './SearchIcon';
import { useSearch } from '@/app/searchContext';
import HideIcon from './HideIcon';
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

    useEffect(() => {
        if (search) setQuery(search);
    }, [search]);

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (topLevel) reset();
            processQuery(query, topLevel);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (topLevel) reset();
        processQuery(query);
    };

    return (
        <>
            <motion.form
                layout
                onSubmit={onSubmit}
                className="flex w-full flex-col items-center justify-center gap-4"
            >
                <div className="relative flex h-full w-full flex-col">
                    <div className="flex h-full w-full">
                        <TextareaAutosize
                            value={query}
                            autoFocus={true}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDownHandler}
                            rows={1}
                            className="h-full w-full rounded-r-none border border-neutral-500 p-4 shadow transition-colors focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:disabled:bg-neutral-700/50"
                            placeholder="Ask anything..."
                        />
                        {close && !topLevel && (
                            <div
                                onClick={close}
                                title="Hide Input"
                                className="flex cursor-pointer items-center border border-neutral-500 bg-white stroke-blue-500 px-2 transition-all hover:bg-neutral-100 hover:stroke-2 dark:border-none dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                            >
                                <HideIcon />
                            </div>
                        )}
                        <button
                            disabled={loading}
                            type="submit"
                            title="Search"
                            className="border border-neutral-500 bg-white stroke-blue-500 px-2 transition-all hover:bg-neutral-100 hover:stroke-2 dark:border-none dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <RGB />
                </div>
            </motion.form>
        </>
    );
}
