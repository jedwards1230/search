'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

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
    const [closing, setClosing] = useState(false);

    const [referenceList, setReferenceList] =
        useState<SearchResult[]>(references);

    useEffect(() => {
        if (references.length > 0) {
            setReferenceList(references);
        }
    }, [references]);

    const toggleReferences = () => {
        if (open) {
            setClosing(true);
        } else {
            setOpen(true);
        }
    };

    return (
        <motion.div
            layout="position"
            className={clsx(
                'flex w-full flex-col justify-start gap-2 lg:w-auto',
                open ? 'lg:min-w-[40%] lg:max-w-[40%]' : ''
            )}
        >
            <div className="flex w-auto items-center justify-between">
                <motion.div
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
                    onClick={toggleReferences}
                >
                    <LinkIcon />
                </motion.div>
            </div>
            {open && (
                <motion.div
                    layout
                    className="flex w-full flex-col overflow-y-auto overflow-x-hidden"
                >
                    <AnimatePresence
                        onExitComplete={() => {
                            setOpen(false);
                            setClosing(false);
                        }}
                    >
                        {referenceList.map((reference, i) => {
                            if (!reference || closing) return null;
                            return (
                                <Reference
                                    numReferences={referenceList.length}
                                    key={`reference-${i}`}
                                    reference={reference}
                                    i={i}
                                />
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
}
