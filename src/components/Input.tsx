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
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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
        <>
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
                        <div
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            title="Settings"
                            className="absolute bottom-2 right-10 top-0 flex cursor-pointer items-center stroke-blue-500 px-2 transition-all hover:stroke-2 dark:bg-neutral-700 dark:stroke-blue-400 dark:hover:bg-neutral-700/50"
                        >
                            <SettingsIcon />
                        </div>
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
            {settingsOpen && (
                <motion.div
                    layout
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-neutral-300/75 dark:bg-neutral-800/75"
                >
                    <div className="relative z-20 flex min-w-[30%] flex-col rounded border border-neutral-300 bg-neutral-200 px-4 py-4 text-neutral-900 shadow-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                        <div className="flex justify-center pb-2 text-lg">
                            Config
                        </div>
                        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                            <div>Model:</div>
                            <select className="bg-inherit">
                                <option value="gpt-3.5-turbo">
                                    gpt-3.5-turbo
                                </option>
                                <option value="gpt-4">gpt-4</option>
                            </select>
                        </div>
                        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                            <div>OpenAI API Key:</div>
                            <input
                                type="text"
                                className="bg-inherit text-right"
                                placeholder="************"
                            />
                        </div>
                        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                            <div>Google API Key:</div>
                            <input
                                type="text"
                                className="bg-inherit text-right"
                                placeholder="************"
                            />
                        </div>
                        <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                            <div>Google CSE API Key:</div>
                            <input
                                type="text"
                                className="bg-inherit text-right"
                                placeholder="************"
                            />
                        </div>
                        <div
                            className="absolute right-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-neutral-300 text-center hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                        >
                            x
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}
