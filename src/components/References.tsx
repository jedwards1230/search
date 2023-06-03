'use client';

import { useState } from 'react';
import LinkIcon from './LinkIcon';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useSearch } from '@/app/searchContext';

export default function References({
    references,
}: {
    references: SearchResult[];
}) {
    const { hideReferences } = useSearch();
    const [open, setOpen] = useState(!hideReferences);

    return (
        <div className="flex w-full flex-col justify-start gap-2">
            <div
                className={clsx(
                    'flex items-center',
                    open ? 'justify-between' : 'justify-center'
                )}
            >
                {open && <div className="text-lg font-medium">References</div>}
                <motion.button
                    layout
                    title="Toggle references"
                    className={clsx(
                        'cursor-pointer',
                        !open &&
                            'pt-0.5 text-neutral-500 transition-colors dark:text-neutral-500'
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <LinkIcon />
                </motion.button>
            </div>
            {open && (
                <div className="w-full overflow-y-auto">
                    {references.map((reference, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={reference.link + i}
                            className="flex flex-col gap-1 pb-2"
                        >
                            <div
                                className={clsx(
                                    'rounded p-2 transition-colors hover:bg-neutral-200/75 dark:hover:bg-neutral-600/50',
                                    !reference.content
                                        ? 'text-neutral-400 dark:text-neutral-500'
                                        : ''
                                )}
                            >
                                <a href={reference.link} target="_blank">
                                    <div>{reference.title}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {reference.snippet}
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
