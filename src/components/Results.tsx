'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { LoadIcon } from './icons';
import ReferenceList from './ReferencesList';
import Result from './Result';
import Input from './Input';
import { formatTime } from '@/lib/utils';
import { useSearch } from '@/app/searchContext';

export default function Results({ result }: { result: Result }) {
    const [edit, setEdit] = useState(false);
    const [started, setStarted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { results } = useSearch();

    useEffect(() => {
        if (scrollRef.current && result.references.length > 0 && !started) {
            scrollRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            setStarted(true);
        }
    }, [result.references, started]);

    return (
        <>
            <div
                ref={scrollRef}
                className="mt-4 flex w-full flex-col gap-4 py-2 first:mt-0 md:gap-6 lg:flex-row lg:gap-8"
            >
                <div className="relative flex h-full flex-1 flex-col items-center justify-between gap-8 pb-6">
                    <div className="sticky bottom-4 top-4 flex w-full flex-col gap-4">
                        <div className="flex w-full flex-col justify-start gap-2 lg:gap-4">
                            <div>
                                <div>
                                    {edit ? (
                                        <Input
                                            search={result.query}
                                            close={() => setEdit(false)}
                                            id={result.id}
                                        />
                                    ) : (
                                        <h2
                                            onClick={() => setEdit(!edit)}
                                            className="line-clamp-4 max-h-48 cursor-pointer rounded p-2 text-xl font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                        >
                                            {result.query}
                                        </h2>
                                    )}
                                </div>
                                <div className="flex w-full justify-between">
                                    <h2 className="pl-2 font-medium">
                                        Result |{' '}
                                        <span
                                            title="Model used for search"
                                            className="font-light"
                                        >
                                            {result.model}
                                        </span>
                                        {result.timeToComplete && (
                                            <>
                                                {' '}
                                                |{' '}
                                                <span
                                                    title="Time to complete search"
                                                    className="font-light"
                                                >
                                                    {formatTime(
                                                        result.timeToComplete
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </h2>
                                    {result.status !== 'Done' && (
                                        <div className="rounded-lg bg-neutral-200 p-1 text-sm transition-all dark:bg-neutral-200 dark:text-neutral-900 dark:selection:bg-neutral-200">
                                            {result.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {result.summary ? (
                                <Result result={result.summary} />
                            ) : (
                                <motion.div
                                    layout
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    className="flex w-full justify-center"
                                >
                                    <LoadIcon />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
                {result.references.length > 0 && (
                    <ReferenceList references={result.references} />
                )}
            </div>

            {result.finished && result.id === results.length - 1 && (
                <div className="sticky bottom-6 w-auto max-w-full md:bottom-4 md:max-w-[60%] md:pr-6 lg:bottom-2">
                    <Input
                        placeholder="Ask a follow-up..."
                        hideToggles={true}
                    />
                </div>
            )}
        </>
    );
}
