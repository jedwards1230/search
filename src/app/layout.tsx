import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Search App',
    description: 'Search-assisted GPT chatbot',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            className="container flex h-full w-full bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-100"
            lang="en"
            suppressHydrationWarning={true}
        >
            <body className={clsx(inter.className, 'flex h-full w-full')}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
