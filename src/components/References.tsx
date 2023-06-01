'use client';

import { useState } from 'react';
import LinkIcon from './LinkIcon';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function References({
    references,
}: {
    references: Observation[];
}) {
    const [open, setOpen] = useState(true);

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
                    {references.map((step, i) => (
                        <div
                            key={step.link + i}
                            className="flex flex-col gap-1 pb-2"
                        >
                            <div className="rounded p-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
                                <a href={step.link} target="_blank">
                                    <div className="pb-1">{step.title}</div>
                                    <div className="text-sm">
                                        {step.snippet}
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
