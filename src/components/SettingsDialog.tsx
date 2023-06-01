'use client';

import { useSearch } from '@/app/searchContext';
import { motion } from 'framer-motion';

export default function SettingsDialog({ close }: { close: () => void }) {
    const { hideReferences, toggleReferences } = useSearch();
    return (
        <motion.dialog
            key="settings-dialog"
            layout
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.2,
            }}
            className="fixed bottom-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-300/75 dark:bg-neutral-800/75"
        >
            <div className="relative flex min-w-[30%] flex-col rounded border border-neutral-300 bg-neutral-200 px-4 py-4 text-neutral-900 shadow-lg dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                <div className="flex justify-center pb-2 text-lg">Config</div>
                <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                    <div>Model:</div>
                    <select className="bg-inherit">
                        <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        <option value="gpt-4">gpt-4</option>
                    </select>
                </div>

                <div className="flex w-full items-center justify-between gap-4 px-4 py-2 dark:bg-neutral-800">
                    <div>Hide References:</div>
                    <input
                        type="checkbox"
                        className="bg-inherit"
                        checked={hideReferences}
                        onChange={toggleReferences}
                    />
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
                    onClick={close}
                >
                    x
                </div>
            </div>
        </motion.dialog>
    );
}
