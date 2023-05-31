'use client';

import clsx from 'clsx';

import { Input, Title } from '@/components';
import { useSearch } from '../app/searchContext';

export default function Header({ search }: { search: string }) {
    const { results } = useSearch();

    return (
        <>
            <div
                className={clsx(
                    'flex w-full flex-col items-center justify-center gap-8',
                    results.length > 0 ? 'md:flex-row' : 'flex-1'
                )}
            >
                <Title />
                <Input topLevel={true} search={search} />
            </div>
        </>
    );
}
