export function checkKeys(config: Config): Keys | undefined {
    if (config.serverSideKeys) {
        return;
    }

    if (!config.keys) {
        alert('Please add your API keys in the config');
        return;
    }

    if (!config.keys.openaiApiKey) {
        alert('Please add your OpenAI API key in the config');
        return;
    }

    if (!config.keys.googleApiKey) {
        alert('Please add your Google API key in the config');
        return;
    }

    if (!config.keys.googleCseApiKey) {
        alert('Please add your Google Search Engine ID in the config');
        return;
    }

    return {
        openaiApiKey: config.keys.openaiApiKey,
        googleApiKey: config.keys.googleApiKey,
        googleCseApiKey: config.keys.googleCseApiKey,
    };
}

export function getConfig(keys?: boolean): Config {
    if (typeof window === 'undefined') {
        return {
            model: 'gpt-3.5-turbo',
            hideReferences: false,
            summarizeReferences: true,
            serverSideKeys: keys ? true : false,
        };
    } else {
        const openaiApiKey = window.localStorage.getItem('openaiApiKey');
        const googleApiKey = window.localStorage.getItem('googleApiKey');
        const googleCseApiKey = window.localStorage.getItem('googleCseApiKey');
        return {
            model: window.localStorage.getItem('model')
                ? (window.localStorage.getItem('model') as Model)
                : 'gpt-3.5-turbo',
            hideReferences:
                window.localStorage.getItem('hideReferences') === 'true',
            summarizeReferences:
                window.localStorage.getItem('summarizeReferences') === 'true',
            keys: keys
                ? undefined
                : {
                      openaiApiKey,
                      googleApiKey,
                      googleCseApiKey,
                  },
            serverSideKeys: keys ? true : false,
        };
    }
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
    window.localStorage.setItem(
        'openaiApiKey',
        config.keys?.openaiApiKey || ''
    );
    window.localStorage.setItem(
        'googleApiKey',
        config.keys?.googleApiKey || ''
    );
    window.localStorage.setItem(
        'googleCseApiKey',
        config.keys?.googleCseApiKey || ''
    );
}
