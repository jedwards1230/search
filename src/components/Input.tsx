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
            className="flex w-full flex-col items-center justify-center gap-4"
        >
            <div className="relative flex h-full w-full flex-col">
                <TextareaAutosize
                    value={query}
                    autoFocus={true}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDownHandler}
                    className="h-full min-h-fit w-full rounded border border-neutral-400 p-4 pr-10 shadow transition-colors focus:outline-none disabled:animate-pulse dark:border-neutral-600 dark:bg-neutral-800"
                    placeholder="Ask anything..."
                />
                <div className="flex">
                    <div className="w-1/3 border-4 border-solid border-red-500"></div>
                    <div className="w-1/3 border-4 border-solid border-green-500"></div>
                    <div className="w-1/3 border-4 border-solid border-blue-500"></div>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    title="Search"
                    className="absolute inset-y-4 right-4"
                >
                    <SearchIcon />
                </button>
            </div>
        </motion.form>
    );
}
