const initialState: State = {
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

export default initialState;
