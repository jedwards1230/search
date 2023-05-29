'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Input, Results, Title } from '@/components';
import { useSearch } from './searchContext';

export default function SearchPage() {
    const router = useRouter();

    const { started, query, setQuery, processQuery } = useSearch();

    const handleSubmit = async () => {
        const newQuery = query.trim();
        setQuery(newQuery);
        if (newQuery === '') return;

        const url = new URL(window.location.href);
        url.searchParams.set('search', newQuery);
        router.replace(url.toString());

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
