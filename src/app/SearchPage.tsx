'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import clsx from 'clsx';
import { Input, Results, Title } from '@/components';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const router = useRouter();

    const [started, setStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(search || '');
    const [results, setResults] = useState('');
    const [references, setReferences] = useState<Observation[]>([]);

    const getResults = async (newQuery: string) => {
        const res = await fetch('/api/get_results', {
            method: 'POST',
            body: JSON.stringify({ query: newQuery }),
        });
        const data = await res.json();

        setReferences(JSON.parse(data.intermediateSteps));

        return data;
    };

    const summarizeResults = async (newQuery: string, results: string) => {
        try {
            const res = await fetch('/api/summarize_results', {
                method: 'POST',
                body: JSON.stringify({ query: newQuery, results: results }),
            });

            const reader = res.body?.getReader();
            let accumulatedResponse = '';

            if (reader) {
                setLoading(false);
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) {
                        const decoded = new TextDecoder().decode(value);
                        accumulatedResponse += decoded;
                    }
                    setResults(accumulatedResponse);
                }
            }

            return accumulatedResponse;
        } catch (err) {
            console.error('Fetch error:', err);
            setResults('Error summarizing results');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newQuery = query.trim();
        setQuery(newQuery);
        if (newQuery === '') return;

        const url = new URL(window.location.href);
        url.searchParams.set('search', newQuery);
        router.replace(url.toString());

        setStarted(true);
        setLoading(true);
        try {
            const data = await getResults(newQuery);
            await summarizeResults(newQuery, JSON.stringify(data));
        } catch (err) {
            console.error('Fetch error:', err);
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className={clsx(
                    'flex w-full items-center justify-center gap-8',
                    started ? 'flex-row' : 'flex-col'
                )}
            >
                <Title />
                <Input
                    loading={loading}
                    handleSubmit={handleSubmit}
                    query={query}
                    setQuery={setQuery}
                />
            </div>
            <Results
                started={started}
                loading={loading}
                results={results}
                references={references}
            />
        </>
    );
}
