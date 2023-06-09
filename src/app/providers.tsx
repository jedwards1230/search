'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SearchProvider } from './searchContext';
import { ConfigProvider } from './configContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider>
                <ConfigProvider>
                    <SearchProvider>{children}</SearchProvider>
                </ConfigProvider>
            </ThemeProvider>
            <Analytics />
        </>
    );
}
