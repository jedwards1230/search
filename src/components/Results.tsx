'use client';

import { motion } from 'framer-motion';

import LoadIcon from './LoadIcon';
import References from './References';
import Result from './Result';
import Input from './Input';
import { useState } from 'react';

export default function Results({ result }: { result: Result }) {
    const [edit, setEdit] = useState(false);

    return (
        <div className="mt-4 flex w-full flex-col gap-8 py-2 first:mt-0 lg:flex-row">
            <div className="relative flex h-full w-full flex-col items-center justify-between gap-8">
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
                                    className="cursor-pointer rounded p-2 text-xl font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                >
                                    {result.query}
                                </h2>
                            )}
                        </div>
                        <h2 className="pl-2 font-medium">
                            Result |{' '}
                            <span className="font-light">{result.model}</span>
                        </h2>
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
                        <div className="w-full">
                            <Input />
                        </div>
                    )}
                </div>
            </div>
            {result.references.length > 0 && (
                <motion.div
                    layout
                    className="w-full lg:w-auto lg:max-w-[30%] lg:p-2"
                >
                    <References references={result.references} />
                </motion.div>
            )}
        </div>
    );
}
