import initialState from './initialState';

export default function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_RESULT':
            return { ...state, results: [...state.results, action.payload] };
        case 'FINISH':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload
                        ? {
                              ...result,
                              loading: false,
                              finished: true,
                          }
                        : result
                ),
            };
        case 'RESET':
            return initialState;
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'TOGGLE_HIDE_REFERENCES':
            return { ...state, hideReferences: !state.hideReferences };
        case 'UPDATE_MODEL':
            return {
                ...state,
                model: action.payload,
            };
        case 'UPDATE_SEARCH_RESULTS':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload.id
                        ? {
                              ...result,
                              references: action.payload.searchResults,
                          }
                        : result
                ),
            };
        case 'UPDATE_SUMMARY':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload.id
                        ? {
                              ...result,
                              summary: action.payload.summary,
                          }
                        : result
                ),
            };
        default:
            return state;
    }
}
