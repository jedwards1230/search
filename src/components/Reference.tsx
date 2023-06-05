import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Reference({
    reference,
    i,
}: {
    reference: SearchResult;
    i: number;
}) {
    if (!reference) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            key={reference.url + i}
            title={!reference.content ? 'Unable to process page' : undefined}
            className="flex flex-col gap-1 pb-2"
        >
            <div
                className={clsx(
                    'rounded p-2 transition-colors duration-300 hover:bg-neutral-200/75 dark:hover:bg-neutral-600/50',
                    !reference.content
                        ? 'text-neutral-500/80 hover:text-neutral-500 dark:text-neutral-500'
                        : ''
                )}
            >
                <a href={reference.url} target="_blank">
                    <div>{reference.title}</div>
                    {reference.content ? (
                        <div className="text-sm text-neutral-700 dark:text-neutral-300">
                            {reference.content}
                        </div>
                    ) : (
                        <div className="text-sm text-neutral-400 dark:text-neutral-500">
                            {reference.snippet}
                        </div>
                    )}
                </a>
            </div>
        </motion.div>
    );
}
