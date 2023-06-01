'use client';

import { motion } from 'framer-motion';

import { useSearch } from '@/app/searchContext';

export default function Title() {
    const { reset } = useSearch();

    return (
        <motion.div
            layout
            onClick={reset}
            className="cursor-pointer text-4xl font-medium underline decoration-black/50 transition-colors hover:decoration-black dark:decoration-white/50 dark:hover:decoration-white"
        >
            Search
        </motion.div>
    );
}
