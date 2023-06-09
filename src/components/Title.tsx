'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useSearch } from '@/app/searchContext';
import RGB from './RGB';

export default function Title() {
    const { results } = useSearch();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.location.reload()}
            className={clsx(
                results.length === 0
                    ? 'text-5xl underline decoration-neutral-900/50 hover:decoration-neutral-950 dark:decoration-white/50 dark:hover:decoration-white md:text-7xl'
                    : 'text-4xl hover:bg-neutral-200 dark:hover:bg-neutral-700 md:text-3xl',
                'cursor-pointer rounded p-1 font-medium tracking-wide transition-all'
            )}
        >
            Search
            {results.length > 0 && <RGB size="sm" />}
        </motion.div>
    );
}
