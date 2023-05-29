import Title from '@/components/Title';
import Results from './results';

export const runtime = 'edge';

export default async function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8">
            <Title />
            <Results />
        </main>
    );
}
