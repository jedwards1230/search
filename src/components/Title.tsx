'use client';

import { motion } from 'framer-motion';

import { useSearch } from '@/app/searchContext';
import RGB from './RGB';
import clsx from 'clsx';

export default function Title() {
    const { reset, results } = useSearch();

    return (
        <motion.div
            //layout
            onClick={reset}
            className={clsx(
                results.length === 0
                    ? 'underline decoration-black/50 hover:decoration-black dark:decoration-white/50 dark:hover:decoration-white'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-600',
                'cursor-pointer rounded p-1 text-4xl font-medium transition-all '
            )}
        >
            Search
            {results.length > 0 && <RGB size="sm" />}
        </motion.div>
    );
}
