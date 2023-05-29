'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import SearchIcon from './SearchIcon';
import { useSearch } from '@/app/searchContext';

export default function Input({
    handleSubmit,
    search,
}: {
    handleSubmit: (newInput: string) => void;
    search?: string | null;
}) {
    const { loading } = useSearch();
    const [query, setQuery] = useState<string>(search || '');

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(query);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(query);
    };

    return (
        <motion.form
            layout
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            onSubmit={onSubmit}
            className="flex w-full flex-col items-center justify-center gap-4 md:w-4/5 md:flex-row"
        >
            <div className="relative h-full w-full">
                <TextareaAutosize
                    value={query}
                    autoFocus={true}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDownHandler}
                    className="h-full min-h-fit w-full rounded border border-neutral-400 p-4 pr-10 transition-colors focus:outline-none disabled:animate-pulse dark:border-neutral-600 dark:bg-neutral-800"
                    placeholder="Ask anything..."
                />
                <button
                    disabled={loading}
                    type="submit"
                    className="absolute inset-y-4 right-4"
                >
                    <SearchIcon />
                </button>
            </div>
            <button
                disabled={loading}
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:border disabled:border-neutral-400 disabled:bg-neutral-300 disabled:text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:border-neutral-100 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-100"
            >
                Search
            </button>
        </motion.form>
    );
}
