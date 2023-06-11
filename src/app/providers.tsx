'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SearchProvider } from './searchContext';
import { ConfigProvider } from './configContext';

export function Providers({
    children,
    keys,
}: {
    children: React.ReactNode;
    keys: boolean;
}) {
    return (
        <>
            <ThemeProvider>
                <ConfigProvider keys={keys}>
                    <SearchProvider>{children}</SearchProvider>
                </ConfigProvider>
            </ThemeProvider>
            <Analytics />
        </>
    );
}
