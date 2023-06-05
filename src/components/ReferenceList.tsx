'use client';

import { useEffect, useState } from 'react';
import LinkIcon from './LinkIcon';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useConfig } from '@/app/config';
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
        <div className="flex w-full flex-col justify-start gap-2 lg:w-auto lg:min-w-[40%] lg:max-w-[40%]">
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
