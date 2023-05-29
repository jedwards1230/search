import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Search App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            className="container bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-100"
            lang="en"
            suppressHydrationWarning={true}
        >
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
