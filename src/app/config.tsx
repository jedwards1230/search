'use client';

import { createContext, useContext, useState } from 'react';

interface ConfigContext {
    config: Config;
    updateConfig: (newConfig: Config) => void;
}

const ConfigContext = createContext<ConfigContext>({
    config: {
        model: 'gpt-3.5-turbo',
        openaiApiKey: '',
        googleApiKey: '',
        googleCseApiKey: '',
        hideReferences: false,
        summarizeReferences: false,
    },
    updateConfig: () => {},
});

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const initialConfig: Config = getConfig();
    const [config, setConfigState] = useState(initialConfig);

    const updateConfig = (newConfig: Config) => {
        setConfigState(newConfig);
        setConfig(newConfig);
    };

    return (
        <ConfigContext.Provider
            value={{
                config,
                updateConfig,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

export default ConfigContext;

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.NEXT_PUBLIC_GOOGLE_CSE_ID;

export function getConfig(): Config {
    let res: Config;
    if (typeof window === 'undefined') {
        res = {
            model: 'gpt-3.5-turbo',
            hideReferences: false,
            summarizeReferences: true,
            openaiApiKey: OPENAI_API_KEY ? OPENAI_API_KEY : null,
            googleApiKey: GOOGLE_API_KEY ? GOOGLE_API_KEY : null,
            googleCseApiKey: GOOGLE_CSE_ID ? GOOGLE_CSE_ID : null,
        };
    } else {
        res = {
            model: window.localStorage.getItem('model')
                ? (window.localStorage.getItem('model') as Model)
                : 'gpt-3.5-turbo',
            hideReferences:
                window.localStorage.getItem('hideReferences') === 'true',
            summarizeReferences:
                window.localStorage.getItem('summarizeReferences') !== 'false',
            openaiApiKey: OPENAI_API_KEY
                ? OPENAI_API_KEY
                : window.localStorage.getItem('openaiApiKey'),
            googleApiKey: GOOGLE_API_KEY
                ? GOOGLE_API_KEY
                : window.localStorage.getItem('googleApiKey'),
            googleCseApiKey: GOOGLE_CSE_ID
                ? GOOGLE_CSE_ID
                : window.localStorage.getItem('googleCseApiKey'),
        };
    }
    return res;
}

export function setConfig(config: Config) {
    window.localStorage.setItem('model', config.model);
    window.localStorage.setItem(
        'hideReferences',
        config.hideReferences.toString()
    );
    window.localStorage.setItem(
        'summarizeReferences',
        config.summarizeReferences.toString()
    );
    window.localStorage.setItem('openaiApiKey', config.openaiApiKey || '');
    window.localStorage.setItem('googleApiKey', config.googleApiKey || '');
    window.localStorage.setItem(
        'googleCseApiKey',
        config.googleCseApiKey || ''
    );
}

export const initialState: State = {
    loading: false,
    results: [],
    processQuery: () => {
        console.error('processQuery not implemented');
    },
    reset: () => {
        console.error('reset not implemented');
    },
    config: getConfig(),
    updateConfig: () => {
        console.error('updateConfig not implemented');
    },
};
