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
                    'flex w-full flex-col items-center gap-8',
                    results.length > 0
                        ? 'justify-between md:flex-row'
                        : 'flex-1 justify-center'
                )}
            >
                <Title />
                {results.length === 0 ? (
                    <Input
                        topLevel={true}
                        search={search}
                        close={() => setSettingsOpen(true)}
                    />
                ) : (
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
