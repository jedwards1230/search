import { Header, ResultsList } from '@/components';
import { Suspense } from 'react';

export const runtime = 'edge';

export default async function Page({ searchParams }: { searchParams: any }) {
    return (
        <main className="flex h-full w-full max-w-full flex-col items-center justify-start gap-8 rounded px-2 py-4 transition-transform lg:px-8">
            <Suspense>
                <Header search={searchParams.q} />
            </Suspense>
            <Suspense>
                <ResultsList />
            </Suspense>
        </main>
    );
}
