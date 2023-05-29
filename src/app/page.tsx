import Results from './SearchPage';

export const runtime = 'edge';

export default async function Page() {
    return (
        <main className="flex min-h-screen w-full max-w-full flex-col items-center justify-center gap-8 px-4 py-8">
            <Results />
        </main>
    );
}
