import { useConfig } from '@/app/config';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Reference({
    reference,
    i,
}: {
    reference: SearchResult;
    i: number;
}) {
    const {
        config: { summarizeReferences },
    } = useConfig();

    if (!reference) return null;
    return (
        <motion.div
            initial={{ opacity: 0, translateX: 150 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: i * 0.1 }}
            key={reference.url + i}
            title={
                !reference.content
                    ? summarizeReferences
                        ? 'Unable to process page'
                        : reference.url
                    : undefined
            }
            className="flex flex-col gap-1 pb-2"
        >
            <div
                className={clsx(
                    'rounded-xl p-2 transition-colors duration-300 hover:bg-neutral-200/75 dark:hover:bg-neutral-600/50',
                    !reference.content
                        ? summarizeReferences
                            ? 'text-neutral-500/80 hover:text-neutral-500 dark:text-neutral-500'
                            : ''
                        : ''
                    // reference.reviewed ? 'bg-green-200 dark:bg-green-700' : ''
                )}
            >
                <a href={reference.url} target="_blank">
                    <div className="line-clamp-1">{reference.title}</div>
                    <div className="truncate pb-1 text-sm text-neutral-500">
                        {reference.url}
                    </div>
                    <div className="transition-all">
                        {reference.content ? (
                            <div className="text-sm text-neutral-700 dark:text-neutral-300">
                                {reference.content}
                            </div>
                        ) : (
                            <div className="text-sm text-neutral-400 dark:text-neutral-500">
                                {reference.snippet}
                            </div>
                        )}
                    </div>
                </a>
            </div>
        </motion.div>
    );
}
