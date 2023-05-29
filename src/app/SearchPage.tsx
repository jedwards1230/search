'use client';

import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';

import { Input, Results, Title } from '@/components';
import { useSearch } from './searchContext';

export default function SearchPage() {
    const { results, started, processQuery, reset } = useSearch();
    const searchParams = useSearchParams();
    const search = searchParams.get('q');

    const handleSubmit = (newInput: string) => {
        reset();
        processQuery(newInput);
    };

    return (
        <>
            <div
                className={clsx(
                    'flex w-full items-center justify-center gap-8',
                    started ? 'flex-col md:flex-row' : 'flex-col'
                )}
            >
                <Title />
                <Input handleSubmit={handleSubmit} search={search} />
            </div>
            {results.map((result, i) => (
                <Results result={result} key={`result-${i}`} />
            ))}
        </>
    );
}
