'use client';

import clsx from 'clsx';

import { Input, SettingsIcon, Title } from '@/components';
import { useSearch } from '../app/searchContext';
import { AnimatePresence } from 'framer-motion';
import SettingsDialog from './SettingsDialog';
import { useState } from 'react';

export default function Header({ search }: { search: string }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { results } = useSearch();

    return (
        <>
            <div
                className={clsx(
                    'flex w-full items-center gap-8',
                    results.length > 0
                        ? 'flex-row justify-between'
                        : 'flex-1 flex-col justify-center'
                )}
            >
                <Title />

                <Input
                    topLevel={true}
                    search={search}
                    close={() => setSettingsOpen(true)}
                />
                {results.length > 0 && (
                    <div
                        onClick={() => setSettingsOpen(true)}
                        className="cursor-pointer"
                    >
                        <SettingsIcon />
                    </div>
                )}
                <AnimatePresence>
                    {settingsOpen && (
                        <SettingsDialog close={() => setSettingsOpen(false)} />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
