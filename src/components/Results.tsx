'use client';

import { motion } from 'framer-motion';

import LoadIcon from './LoadIcon';
import References from './References';
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
            <div className="relative flex h-full w-full flex-col items-center justify-between gap-8 pb-6">
                <div className="sticky top-4 flex w-full flex-col gap-4">
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
                                <div className="rounded-lg p-1 text-sm transition-all dark:bg-neutral-200 dark:text-neutral-900">
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
                        <div className="sticky bottom-4 w-full">
                            <Input />
                        </div>
                    )}
                </div>
            </div>
            {result.references.length > 0 && (
                <motion.div layout className="w-full lg:w-auto lg:max-w-[30%]">
                    <References references={result.references} />
                </motion.div>
            )}
        </div>
    );
}
