'use client';

import { useConfig } from '@/app/config';
import { motion } from 'framer-motion';
import { CloseIcon } from '../icons';

export default function SettingsDialog({ close }: { close: () => void }) {
    const {
        config: {
            hideReferences,
            summarizeReferences,
            model,
            openaiApiKey,
            googleApiKey,
            googleCseApiKey,
        },
        setConfigState,
    } = useConfig();
    return (
        <motion.dialog
            key="settings-dialog"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed bottom-0 left-0 z-30 flex h-screen w-screen items-start justify-center bg-neutral-200/75 dark:bg-neutral-950/80 md:items-center"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="relative flex w-full flex-col rounded-md border border-neutral-100 bg-neutral-50 px-4 py-4 text-neutral-900 shadow-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 md:w-auto"
            >
                <div className="flex justify-center pb-4 text-lg">Config</div>
                <div className="flex flex-col gap-4 rounded p-2">
                    <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>Model:</div>
                        <select
                            value={model}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    model: e.target.value as Model,
                                }))
                            }
                            className="rounded border border-neutral-500 bg-inherit p-2"
                        >
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                            <option value="gpt-4">gpt-4</option>
                        </select>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                        <div>Show References:</div>
                        <input
                            type="checkbox"
                            className="cursor-pointer bg-inherit"
                            checked={!hideReferences}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    hideReferences: !e.target.checked,
                                }))
                            }
                        />
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                        <div>Summarize References:</div>
                        <input
                            type="checkbox"
                            className="cursor-pointer bg-inherit"
                            checked={summarizeReferences}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    summarizeReferences: e.target.checked,
                                }))
                            }
                        />
                    </div>
                    <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>OpenAI API Key:</div>
                        <motion.input
                            type={openaiApiKey ? 'password' : 'text'}
                            value={openaiApiKey || ''}
                            onFocus={(e) => {
                                e.target.type = 'text';
                                e.target.selectionStart =
                                    e.target.selectionEnd =
                                        e.target.value.length;
                            }}
                            onBlur={(e) => (e.target.type = 'password')}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    openaiApiKey: e.target.value,
                                }))
                            }
                            className="rounded border border-neutral-500 bg-inherit p-2 focus:outline-none md:text-right"
                            placeholder="************"
                        />
                    </div>
                    <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>Google API Key:</div>
                        <input
                            type={googleApiKey ? 'password' : 'text'}
                            value={googleApiKey || ''}
                            onFocus={(e) => {
                                e.target.type = 'text';
                                e.target.selectionStart =
                                    e.target.selectionEnd =
                                        e.target.value.length;
                            }}
                            onBlur={(e) => (e.target.type = 'password')}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    googleApiKey: e.target.value,
                                }))
                            }
                            className="rounded border border-neutral-500 bg-inherit p-2 focus:outline-none md:text-right"
                            placeholder="************"
                        />
                    </div>
                    <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>Google CSE API Key:</div>
                        <input
                            type={googleCseApiKey ? 'password' : 'text'}
                            value={googleCseApiKey || ''}
                            onFocus={(e) => {
                                e.target.type = 'text';
                                e.target.selectionStart =
                                    e.target.selectionEnd =
                                        e.target.value.length;
                            }}
                            onBlur={(e) => (e.target.type = 'password')}
                            onChange={(e) =>
                                setConfigState((s) => ({
                                    ...s,
                                    googleCseApiKey: e.target.value,
                                }))
                            }
                            className="rounded border border-neutral-500 bg-inherit p-2 focus:outline-none md:text-right"
                            placeholder="************"
                        />
                    </div>
                </div>
                <div
                    className="absolute right-6 top-4 flex cursor-pointer items-center justify-center rounded-full p-2 text-center hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    onClick={close}
                >
                    <CloseIcon />
                </div>
            </div>
        </motion.dialog>
    );
}
