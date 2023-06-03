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
                    ? 'underline decoration-black/50 hover:decoration-black dark:decoration-white/50 dark:hover:decoration-white'
                    : 'text-4xl hover:bg-neutral-200 dark:hover:bg-neutral-600',
                'cursor-pointer rounded p-1 text-5xl font-medium transition-all'
            )}
        >
            Search
            {results.length > 0 && <RGB size="sm" />}
        </div>
    );
}
