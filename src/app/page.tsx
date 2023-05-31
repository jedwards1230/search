import { Header, ResultsList } from '@/components';

export const runtime = 'edge';

export default async function Page({ searchParams }: { searchParams: any }) {
    return (
        <main className="flex min-h-fit w-full max-w-full flex-col items-center justify-start gap-8 px-4 py-8">
            <Header search={searchParams.q} />
            <ResultsList />
        </main>
    );
}
