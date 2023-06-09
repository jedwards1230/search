'use client';

import { useConfig } from '@/app/configContext';
import { motion } from 'framer-motion';
import { CloseIcon } from '../icons';
import InputField from './InputField';
import CheckboxField from './CheckboxField';

export default function SettingsDialog({ close }: { close: () => void }) {
    const { config, updateConfig } = useConfig();
    const {
        hideReferences,
        summarizeReferences,
        model,
        openaiApiKey,
        googleApiKey,
        googleCseApiKey,
    } = config;
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
                                updateConfig({
                                    ...config,
                                    model: e.target.value as Model,
                                })
                            }
                            className="rounded border border-neutral-500 bg-inherit p-2"
                        >
                            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                            <option value="gpt-4">gpt-4</option>
                        </select>
                    </div>
                    <CheckboxField
                        label="Show References"
                        checked={!hideReferences}
                        onChange={(e) =>
                            updateConfig({
                                ...config,
                                hideReferences: !e.target.checked,
                            })
                        }
                    />
                    <CheckboxField
                        label="Summarize References"
                        checked={summarizeReferences}
                        onChange={(e) =>
                            updateConfig({
                                ...config,
                                summarizeReferences: e.target.checked,
                            })
                        }
                    />
                    <InputField
                        label="OpenAI API Key"
                        type={openaiApiKey ? 'password' : 'text'}
                        value={openaiApiKey || ''}
                        placeholder="************"
                        onChange={(e) =>
                            updateConfig({
                                ...config,
                                openaiApiKey: e.target.value,
                            })
                        }
                    />
                    <InputField
                        label="Google API Key"
                        type={googleApiKey ? 'password' : 'text'}
                        value={googleApiKey || ''}
                        placeholder="************"
                        onChange={(e) =>
                            updateConfig({
                                ...config,
                                googleApiKey: e.target.value,
                            })
                        }
                    />
                    <InputField
                        label="Google CSE API Key"
                        type={googleCseApiKey ? 'password' : 'text'}
                        value={googleCseApiKey || ''}
                        placeholder="************"
                        onChange={(e) =>
                            updateConfig({
                                ...config,
                                googleCseApiKey: e.target.value,
                            })
                        }
                    />
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
