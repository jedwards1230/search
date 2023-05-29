'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import LoadIcon from './LoadIcon';
import References from './References';

export default function Results({
    started,
    loading,
    results,
    references,
}: {
    started: boolean;
    loading: boolean;
    results: string;
    references: Observation[];
}) {
    return (
        <div className="flex gap-8">
            <motion.div layout className="flex w-full flex-col items-center">
                {started && (
                    <div className="flex w-full flex-col p-2">
                        <h2 className="pb-2 text-lg font-medium">Results</h2>
                        <ReactMarkdown
                            className="prose prose-neutral prose-a:text-blue-600 flex flex-col overflow-x-scroll rounded px-3 py-2 [&>*]:my-1"
                            remarkPlugins={[remarkGfm]}
                        >
                            {results}
                        </ReactMarkdown>
                    </div>
                )}
                {started && (loading || !results) && (
                    <div className="flex justify-center">
                        <LoadIcon />
                    </div>
                )}
            </motion.div>
            {references.length > 0 && (
                <motion.div layout className="w-1/3 p-2">
                    <References intermediateSteps={references} />
                </motion.div>
            )}
        </div>
    );
}
