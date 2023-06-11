'use client';

import { useSearch } from '@/app/searchContext';
import Results from './Results';
import { motion } from 'framer-motion';

export default function ResultsList() {
    const { results } = useSearch();

    if (results.length === 0) {
        return null;
    }
    return (
        <motion.div
            layout="position"
            className="relative flex w-full flex-col gap-8 pb-8 lg:pb-4"
        >
            {results.map((result, i) => {
                if (!result) return null;
                return <Results result={result} key={`result-${i}`} />;
            })}
        </motion.div>
    );
}
