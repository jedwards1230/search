'use client';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import { SearchContextProvider } from './searchContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider>
                <SearchContextProvider>{children}</SearchContextProvider>
            </ThemeProvider>
            <Analytics />
        </>
    );
}
