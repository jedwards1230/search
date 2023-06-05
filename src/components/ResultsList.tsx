'use client';

import { useSearch } from '@/app/searchContext';
import Results from './Results';

export default function ResultsList() {
    const { results } = useSearch();

    if (results.length === 0) {
        return null;
    }
    return (
        <div className="flex w-full flex-col gap-8">
            {results.map((result, i) => {
                if (!result) return null;
                return <Results result={result} key={`result-${i}`} />;
            })}
        </div>
    );
}
