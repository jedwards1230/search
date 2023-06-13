'use client';

import { getConfig, setConfig } from '@/lib/config';
import { createContext, useContext, useState } from 'react';

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

interface ConfigContext {
    config: Config;
    updateConfig: (newConfig: Config) => void;
}

const ConfigContext = createContext<ConfigContext>({
    config: {
        model: 'gpt-3.5-turbo-16k',
        hideReferences: false,
        summarizeReferences: false,
    },
    updateConfig: () => {},
});

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({
    children,
    keys,
}: {
    children: React.ReactNode;
    keys: boolean;
}) {
    const initialConfig: Config = getConfig(keys);
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
