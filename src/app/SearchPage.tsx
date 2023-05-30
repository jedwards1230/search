'use client';

import clsx from 'clsx';

import { Input, Results, Title } from '@/components';
import { useSearch } from './searchContext';

export default function SearchPage({ search }: { search: string }) {
    const { results, started, processQuery, reset } = useSearch();

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
            <div className="flex flex-col gap-8">
                {results.map((result, i) => (
                    <Results result={result} key={`result-${i}`} />
                ))}
            </div>
        </>
    );
}
