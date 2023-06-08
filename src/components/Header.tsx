'use client';

import { useState } from 'react';
import clsx from 'clsx';

import { Input, Title } from '@/components';
import { useSearch } from '../app/searchContext';
import SettingsButton from './SettingsButton';

export default function Header({ search }: { search: string }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { results } = useSearch();

    return (
        <>
            <div
                className={clsx(
                    'flex w-full flex-col items-center ',
                    results.length > 0
                        ? 'justify-between gap-4 md:flex-row'
                        : 'flex-1 justify-center gap-12 md:gap-8'
                )}
            >
                <div
                    className={clsx(
                        'relative flex w-full justify-center md:w-auto md:pt-2',
                        results.length > 0
                            ? 'h-full items-center md:items-start'
                            : 'items-center'
                    )}
                >
                    <Title />
                    <div
                        className={clsx([
                            results.length > 0
                                ? 'absolute right-0 order-2 md:hidden'
                                : 'fixed right-4 top-4',
                        ])}
                    >
                        <SettingsButton
                            open={settingsOpen}
                            openDialog={() => setSettingsOpen(true)}
                            closeDialog={() => setSettingsOpen(false)}
                        />
                    </div>
                </div>
                <Input
                    topLevel={true}
                    search={search}
                    close={() => setSettingsOpen(true)}
                />
                <div
                    className={clsx([
                        results.length > 0
                            ? 'static order-2 hidden h-full pt-2 md:flex md:items-start'
                            : 'fixed right-4 top-4',
                    ])}
                >
                    <SettingsButton
                        open={settingsOpen}
                        openDialog={() => setSettingsOpen(true)}
                        closeDialog={() => setSettingsOpen(false)}
                    />
                </div>
            </div>
        </>
    );
}
