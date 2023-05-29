'use client';

import { motion } from 'framer-motion';

import LoadIcon from './LoadIcon';
import References from './References';
import { useSearch } from '@/app/searchContext';
import Result from './Result';
import Input from './Input';

export default function Results({ result }: { result: Result }) {
    const { loading, processQuery } = useSearch();

    return (
        <div className="flex w-full flex-col gap-8 lg:flex-row">
            <div className="flex w-full flex-col items-center">
                {!loading ? (
                    <div className="flex w-full flex-col justify-center lg:p-2">
                        <h2 className="pb-2 text-lg font-medium">
                            {result.query}
                        </h2>
                        <h2 className="pb-2 text-lg font-medium">
                            Result |{' '}
                            <span className="text-lg font-light">
                                {result.model}
                            </span>
                        </h2>
                        <Result result={result.summary} />
                        {result.finished && (
                            <Input handleSubmit={processQuery} />
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <LoadIcon />
                    </div>
                )}

                {/* {started && (loading || !result) && (
                    <div className="flex justify-center">
                        <LoadIcon />
                    </div>
                )} */}
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
                    className="w-full lg:w-1/3 lg:p-2"
                >
                    <References intermediateSteps={result.references} />
                </motion.div>
            )}
        </div>
    );
}
