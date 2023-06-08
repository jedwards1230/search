'use client';

import { useSearch } from '@/app/searchContext';
import RGB from './RGB';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Title() {
    const { reset, results } = useSearch();
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
                router.push('/');
                reset();
            }}
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
