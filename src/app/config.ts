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
            openaiApiKey: null,
            googleApiKey: null,
            googleCseApiKey: null,
        };
    return {
        model: window.localStorage.getItem('model')
            ? (window.localStorage.getItem('model') as Model)
            : 'gpt-3.5-turbo',
        hideReferences:
            window.localStorage.getItem('hideReferences') === 'true',
        openaiApiKey: window.localStorage.getItem('openaiApiKey'),
        googleApiKey: window.localStorage.getItem('googleApiKey'),
        googleCseApiKey: window.localStorage.getItem('googleCseApiKey'),
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
