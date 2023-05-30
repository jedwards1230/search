'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import LoadIcon from './LoadIcon';
import References from './References';
import { useSearch } from '@/app/searchContext';
import Result from './Result';
import Input from './Input';

export default function Results({ result }: { result: Result }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const { processQuery } = useSearch();

    if (!isInView) {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div
            ref={ref}
            className="mt-4 flex w-full flex-col gap-8 pt-2 first:mt-0 lg:flex-row"
        >
            <div className="relative flex w-full flex-col items-center gap-8 overflow-x-scroll">
                {result.summary ? (
                    <div className="flex w-full flex-col justify-start gap-4 lg:p-2">
                        <h2 className="text-xl font-medium">{result.query}</h2>
                        <h2 className="text-lg font-medium">
                            Result |{' '}
                            <span className="text-lg font-light">
                                {result.model}
                            </span>
                        </h2>
                        <Result result={result.summary} />
                    </div>
                ) : (
                    <div className="flex w-full justify-center">
                        <LoadIcon />
                    </div>
                )}

                {result.finished && (
                    <div className="w-full">
                        <Input
                            handleSubmit={processQuery}
                            search={result.query}
                        />
                    </div>
                )}
            </div>
            {result.references.length > 0 && (
                <motion.div
                    layout
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    className="w-full lg:w-auto lg:max-w-[30%] lg:p-2"
                >
                    <References references={result.references} />
                </motion.div>
            )}
        </div>
    );
}
