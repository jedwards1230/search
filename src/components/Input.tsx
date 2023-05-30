'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import SearchIcon from './SearchIcon';
import { useSearch } from '@/app/searchContext';
import SettingsIcon from './SettingsIcon';

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
                <div className="flex h-full w-full pr-20">
                    <TextareaAutosize
                        value={query}
                        autoFocus={true}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDownHandler}
                        className="h-full w-full rounded-r-none border border-neutral-400 p-4 shadow transition-colors focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:disabled:bg-neutral-700/50"
                        placeholder="Ask anything..."
                    />
                </div>
                <div className="flex">
                    <div className="h-2 w-1/3 border-4 border-solid border-red-500"></div>
                    <div className="h-2 w-1/3 border-4 border-solid border-green-500"></div>
                    <div className="h-2 w-1/3 border-4 border-solid border-blue-500"></div>
                </div>
                <div>
                    <button
                        type="submit"
                        title="Settings"
                        className="absolute bottom-2 right-10 top-0 stroke-blue-500 px-2 transition-all hover:stroke-2 dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                    >
                        <SettingsIcon />
                    </button>
                    <button
                        disabled={loading}
                        type="submit"
                        title="Search"
                        className="absolute bottom-2 right-0 top-0 stroke-blue-500 px-2 transition-all hover:stroke-2 dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                    >
                        <SearchIcon />
                    </button>
                </div>
            </div>
        </motion.form>
    );
}
