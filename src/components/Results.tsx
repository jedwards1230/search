'use client';

import { motion } from 'framer-motion';

import LoadIcon from './LoadIcon';
import ReferenceList from './ReferenceList';
import Result from './Result';
import Input from './Input';
import { useEffect, useRef, useState } from 'react';

export default function Results({ result }: { result: Result }) {
    const [edit, setEdit] = useState(false);
    const [started, setStarted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current && !started) {
            scrollRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            setStarted(true);
        }
    }, [result.summary, started]);

    return (
        <div
            ref={scrollRef}
            className="mt-4 flex w-full flex-col gap-8 py-2 first:mt-0 lg:flex-row"
        >
            <div className="relative flex h-full flex-1 flex-col items-center justify-between gap-8 pb-6">
                <div className="sticky bottom-4 top-4 flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col justify-start gap-2 lg:gap-4">
                        <div>
                            {edit ? (
                                <Input
                                    search={result.query}
                                    close={() => setEdit(false)}
                                />
                            ) : (
                                <h2
                                    onClick={() => setEdit(!edit)}
                                    className="line-clamp-4 max-h-48 cursor-pointer rounded p-1 px-2 text-xl font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    {result.query}
                                </h2>
                            )}
                        </div>
                        <div className="flex w-full justify-between">
                            <h2 className="pl-2 font-medium">
                                Result |{' '}
                                <span className="font-light">
                                    {result.model}
                                </span>
                            </h2>
                            {result.status !== 'Done' && (
                                <div className="rounded-lg bg-neutral-300 p-1 text-sm transition-all dark:bg-neutral-200 dark:text-neutral-900 dark:selection:bg-neutral-200">
                                    {result.status}
                                </div>
                            )}
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
                    {result.finished && (
                        <div className=" w-full">
                            <Input />
                        </div>
                    )}
                </div>
            </div>
            {result.references.length > 0 && (
                <ReferenceList references={result.references} />
            )}
        </div>
    );
}
