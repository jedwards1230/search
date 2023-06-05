type Config = {
    model: Model;
    hideReferences: boolean;
    openaiApiKey: string | null;
    googleApiKey: string | null;
    googleCseApiKey: string | null;
};

export function getConfig(): Config {
    return {
        model: window.localStorage.getItem('model') as Model,
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
    model: 'gpt-3.5-turbo',
    hideReferences: false,
    toggleReferences: () => {
        console.log('toggleReferences not implemented');
    },
    processQuery: () => {
        console.log('processQuery not implemented');
    },
    reset: () => {
        console.log('reset not implemented');
    },
    setModel: () => {
        console.log('setModel not implemented');
    },
};
