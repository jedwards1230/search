'use client';

import { motion } from 'framer-motion';

import LoadIcon from './LoadIcon';
import References from './References';
import Result from './Result';
import Input from './Input';

export default function Results({ result }: { result: Result }) {
    return (
        <div className="mt-4 flex w-full flex-col gap-8 py-2 first:mt-0 lg:flex-row">
            <div className="relative flex w-full flex-col items-center justify-start gap-8 overflow-x-scroll">
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

                {result.finished && (
                    <div className="w-full">
                        <Input />
                    </div>
                )}
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
