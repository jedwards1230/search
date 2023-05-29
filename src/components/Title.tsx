'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Title() {
    const router = useRouter();

    return (
        <motion.div
            layout
            onClick={() => router.refresh()}
            className="cursor-pointer text-4xl font-medium underline decoration-black/50 transition-colors hover:decoration-black dark:decoration-white/50 dark:hover:decoration-white"
        >
            Search
        </motion.div>
    );
}
