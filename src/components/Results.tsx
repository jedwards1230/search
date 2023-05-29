'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SpecialComponents } from 'react-markdown/lib/ast-to-react';
import { NormalComponents } from 'react-markdown/lib/complex-types';

import LoadIcon from './LoadIcon';
import References from './References';
import { useSearch } from '@/app/searchContext';

const mdComponents: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
> = {
    h1: ({ node, ...props }) => (
        <h1 {...props} className="text-2xl font-bold" />
    ),
    h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold" />,
    h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold" />,
    h4: ({ node, ...props }) => (
        <h4 {...props} className="text-base font-bold" />
    ),
    h5: ({ node, ...props }) => <h5 {...props} className="text-sm font-bold" />,
    h6: ({ node, ...props }) => <h6 {...props} className="text-xs font-bold" />,
    p: ({ node, ...props }) => <p {...props} className="text-base" />,
    blockquote: ({ node, ...props }) => (
        <blockquote {...props} className="border-l-4 border-blue-500 pl-4" />
    ),
    br: ({ node, ...props }) => <br {...props} className="my-1" />,
    code: ({ node, ...props }) => (
        <code {...props} className="rounded bg-gray-100 px-1 py-0.5" />
    ),
    em: ({ node, ...props }) => <em {...props} className="italic" />,
    strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
    hr: ({ node, ...props }) => <hr {...props} className="my-2" />,
    li: ({ node, ...props }) => <li {...props} className="list-disc" />,
    ol: ({ node, ...props }) => <ol {...props} className="list-decimal" />,
    ul: ({ node, ...props }) => <ul {...props} className="list-disc" />,
    pre: ({ node, ...props }) => (
        <pre {...props} className="rounded bg-gray-100 p-2" />
    ),
    a: ({ node, ...props }) => (
        <a {...props} className="text-blue-500 hover:underline" />
    ),
    del: ({ node, ...props }) => <del {...props} className="line-through" />,
    input: ({ node, ...props }) => (
        <input {...props} className="rounded bg-gray-100 px-1 py-0.5" />
    ),
    table: ({ node, ...props }) => (
        <table {...props} className="border-collapse border border-gray-300" />
    ),
    tbody: ({ node, ...props }) => <tbody {...props} />,
    td: ({ node, ...props }) => (
        <td {...props} className="border border-gray-300 px-2 py-1" />
    ),
    th: ({ node, ...props }) => (
        <th {...props} className="border border-gray-300 px-2 py-1" />
    ),
    thead: ({ node, ...props }) => <thead {...props} />,
    tr: ({ node, ...props }) => <tr {...props} className="border" />,
};

export default function Results({ started }: { started: boolean }) {
    const { loading, results, references } = useSearch();
    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex w-full flex-col items-center">
                {started && results && (
                    <div className="flex w-full flex-col p-2">
                        <h2 className="pb-2 text-lg font-medium">Results</h2>
                        <ReactMarkdown
                            className="prose prose-neutral prose-a:text-blue-600 flex flex-col overflow-x-scroll rounded px-3 py-2 [&>*]:my-1"
                            remarkPlugins={[remarkGfm]}
                            components={mdComponents}
                        >
                            {results}
                        </ReactMarkdown>
                    </div>
                )}
                {started && (loading || !results) && (
                    <div className="flex justify-center">
                        <LoadIcon />
                    </div>
                )}
            </div>
            {references.length > 0 && (
                <motion.div
                    layout
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    className="w-full p-2 lg:w-1/3"
                >
                    <References intermediateSteps={references} />
                </motion.div>
            )}
        </div>
    );
}
