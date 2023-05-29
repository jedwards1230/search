'use client';

import clsx from 'clsx';

import { Input, Results, Title } from '@/components';
import { useSearch } from './searchContext';

export default function SearchPage() {
    const { started, query, processQuery } = useSearch();

    const handleSubmit = async () => {
        const newQuery = query.trim();
        if (newQuery === '') return;

        processQuery(newQuery);
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
                <Input handleSubmit={handleSubmit} />
            </div>
            <Results started={started} />
        </>
    );
}
