import { SearchPage } from '@/components';

export const runtime = 'edge';

export default async function Page({ searchParams }: { searchParams: any }) {
    return (
        <main className="flex min-h-screen w-full max-w-full flex-col items-center justify-center gap-8 py-8 lg:px-4">
            <SearchPage search={searchParams.q} />
        </main>
    );
}
