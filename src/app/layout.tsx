import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import clsx from 'clsx';
import type { Metadata } from 'next';

const APP_NAME = 'Search App';
const APP_DEFAULT_TITLE = 'My Awesome Search App';
const APP_TITLE_TEMPLATE = '%s - Search App';
const APP_DESCRIPTION = 'Search-assisted GPT chatbot';

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    manifest: '/manifest.json',
    themeColor: '#FFFFFF',
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
