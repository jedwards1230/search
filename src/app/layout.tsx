import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import clsx from 'clsx';
import type { Metadata } from 'next';

const APP_NAME = 'Search';
const APP_DEFAULT_TITLE = 'Search';
const APP_TITLE_TEMPLATE = 'Search - %s';
const APP_DESCRIPTION = 'Search-assisted GPT chatbot';

export const metadata: Metadata = {
    metadataBase: new URL('http://localhost:3000'),
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: '/manifest.json',
    themeColor: '#262626',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            className="mx-auto flex h-full w-full bg-neutral-50 p-2 text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-100 lg:max-w-7xl"
            lang="en"
            suppressHydrationWarning={true}
        >
            <body className={clsx(inter.className, 'flex h-full w-full')}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
