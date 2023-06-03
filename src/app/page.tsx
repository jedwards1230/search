import { Header, ResultsList } from '@/components';
import { Suspense } from 'react';

export const runtime = 'edge';

export default async function Page({ searchParams }: { searchParams: any }) {
    return (
        <main className="flex min-h-fit w-full max-w-full flex-col items-center justify-start gap-8 px-2 py-8 md:px-4 lg:px-12">
            <Suspense>
                <Header search={searchParams.q} />
            </Suspense>
            <Suspense>
                <ResultsList />
            </Suspense>
        </main>
    );
}
