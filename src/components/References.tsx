'use client';

import { useState } from 'react';
import LinkIcon from './LinkIcon';
import clsx from 'clsx';

export default function References({
    references,
}: {
    references: Observation[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex w-full flex-col justify-start gap-2">
            <div className="flex items-center justify-between">
                {open && <div className="text-lg font-medium">References</div>}
                <button
                    className={clsx(
                        'cursor-pointer',
                        !open &&
                            'pt-0.5 text-neutral-100 transition-colors dark:text-neutral-500'
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <LinkIcon />
                </button>
            </div>
            {open && (
                <div className="w-full overflow-y-auto">
                    {references.map((step, i) => (
                        <div
                            key={step.link + i}
                            className="flex flex-col gap-1 pb-2"
                        >
                            <div className="rounded p-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
                                <a href={step.link} target="_blank">
                                    <div className="pb-1">{step.title}</div>
                                    <div className="text-sm">
                                        {step.snippet}
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
