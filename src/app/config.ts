'use client';

import { useState, useEffect } from 'react';

export function useConfig() {
    const [config, setConfigState] = useState(getConfig());

    useEffect(() => {
        setConfig(config);
    }, [config]);

    return { config, setConfigState };
}

export function getConfig(): Config {
    if (typeof window === 'undefined')
        return {
            model: 'gpt-3.5-turbo',
            hideReferences: false,
            openaiApiKey: process.env.OPENAI_API_KEY || null,
            googleApiKey: process.env.GOOGLE_API_KEY || null,
            googleCseApiKey: process.env.GOOGLE_CSE_ID || null,
        };
    return {
        model: window.localStorage.getItem('model')
            ? (window.localStorage.getItem('model') as Model)
            : 'gpt-3.5-turbo',
        hideReferences:
            window.localStorage.getItem('hideReferences') === 'true',
        openaiApiKey:
            process.env.OPENAI_API_KEY ||
            window.localStorage.getItem('openaiApiKey'),
        googleApiKey:
            process.env.GOOGLE_API_KEY ||
            window.localStorage.getItem('googleApiKey'),
        googleCseApiKey:
            process.env.GOOGLE_CSE_ID ||
            window.localStorage.getItem('googleCseApiKey'),
    };
}

export function setConfig(config: Config) {
    window.localStorage.setItem('model', config.model);
    window.localStorage.setItem(
        'hideReferences',
        config.hideReferences.toString()
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
        console.log('processQuery not implemented');
    },
    reset: () => {
        console.log('reset not implemented');
    },
};
