'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { LinkIcon } from '../icons';
import { useConfig } from '@/app/configContext';
import Reference from './Reference';

export default function ReferenceList({
    references,
}: {
    references: SearchResult[];
}) {
    const {
        config: { hideReferences },
    } = useConfig();
    const [open, setOpen] = useState(!hideReferences);
    const [referenceList, setReferenceList] =
        useState<SearchResult[]>(references);

    useEffect(() => {
        if (references.length > 0) {
            setReferenceList(references);
        }
    }, [references]);

    return (
        <div
            className={clsx(
                'flex w-full flex-col justify-start gap-2 lg:w-auto',
                open ? 'lg:min-w-[40%] lg:max-w-[40%]' : ''
            )}
        >
            <div className="flex w-auto items-center justify-between">
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={clsx(
                        'text-lg font-medium',
                        !open && 'lg:hidden'
                    )}
                >
                    References
                </motion.div>
                <motion.div
                    layout
                    title="Toggle references"
                    className={clsx(
                        'cursor-pointer rounded-full p-2 hover:bg-neutral-200 hover:dark:bg-neutral-600',
                        !open &&
                            'pt-2 text-neutral-500 transition-colors dark:text-neutral-500'
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <LinkIcon />
                </motion.div>
            </div>
            {open && (
                <div className="w-full overflow-y-auto">
                    {referenceList.map((reference, i) => (
                        <Reference
                            reference={reference}
                            i={i}
                            key={`reference-${i}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
