'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SearchProvider } from './searchContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider>
                <SearchProvider>{children}</SearchProvider>
            </ThemeProvider>
            <Analytics />
        </>
    );
}
