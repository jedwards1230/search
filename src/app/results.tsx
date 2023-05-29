'use client';

import LoadIcon from '@/components/LoadIcon';
import References from '@/components/References';
import SearchIcon from '@/components/SearchIcon';
import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function Results() {
    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState('');
    const [references, setReferences] = useState<Observation[]>([]);
    const [intermediateSteps, setIntermediateSteps] = useState<
        IntermediateStep[]
    >([]);

    const getResults = async (newQuery: string) => {
        const res = await fetch('/api/get_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery }),
        });
        const data = await res.json();

        setIntermediateSteps(data.intermediateSteps);

        const steps = data.intermediateSteps.reduce(
            (acc: Observation[], step: any) => {
                return acc.concat(JSON.parse(step.observation));
            },
            []
        );

        // only add steps that are valid Observation Objects
        setReferences(
            steps.filter((step: any) => {
                return step.hasOwnProperty('observation');
            })
        );

        return data;
    };

    const summarizeResults = async (newQuery: string, results: string) => {
        const res = await fetch('/api/summarize_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery, results: results }),
        });
        const data = await res.json();
        const summary = data.summary;

        setResults(summary);

        return summary;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        const newQuery = query.trim();
        setQuery(newQuery);
        if (newQuery === '') return;

        setStarted(true);
        setLoading(true);
        e.preventDefault();
        try {
            const data = await getResults(newQuery);
            await summarizeResults(newQuery, JSON.stringify(data));
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setLoading(false);
        }
    };

    return (
        <>
            <motion.form
                layout
                onSubmit={handleSubmit}
                className="flex w-4/5 items-center justify-center gap-4"
            >
                <div className="relative h-full w-full">
                    <TextareaAutosize
                        value={query}
                        autoFocus={true}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-full min-h-fit w-full rounded border border-neutral-400 p-4 transition-colors focus:outline-none disabled:animate-pulse dark:bg-neutral-700"
                        placeholder="Ask anything..."
                    />
                    <button
                        disabled={loading}
                        type="submit"
                        className="absolute inset-y-4 right-4"
                    >
                        <SearchIcon />
                    </button>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:border disabled:border-neutral-400 disabled:bg-neutral-300 disabled:text-black"
                >
                    Search
                </button>
            </motion.form>
            <div className="flex gap-2">
                <motion.div
                    layout
                    className="flex w-full flex-col items-center"
                >
                    {started && (
                        <div className="flex w-full flex-col p-2">
                            <h2 className="pb-2 text-lg font-medium">
                                Results
                            </h2>
                            {results}
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
        </>
    );
}
