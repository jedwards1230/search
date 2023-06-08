'use client';

import { useSearch } from '@/app/searchContext';
import RGB from './RGB';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function Title() {
    const { reset, results } = useSearch();
    const router = useRouter();

    return (
        <div
            onClick={() => {
                router.push('/');
                reset();
            }}
            className={clsx(
                results.length === 0
                    ? 'text-5xl underline decoration-neutral-900/50 hover:decoration-neutral-950 dark:decoration-white/50 dark:hover:decoration-white md:text-7xl'
                    : 'text-3xl hover:bg-neutral-200 dark:hover:bg-neutral-700',
                'cursor-pointer rounded p-1 font-medium tracking-wide transition-all'
            )}
        >
            Search
            {results.length > 0 && <RGB size="sm" />}
        </div>
    );
}
