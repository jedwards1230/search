import { initialState } from './config';

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
                              status: 'Done',
                          }
                        : result
                ),
            };
        case 'RESET':
            return initialState;
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'UPDATE_SEARCH_RESULTS':
            return {
                ...state,
                results: state.results.map((result) =>
                    result.id === action.payload.id
                        ? {
                              ...result,
                              references: action.payload.searchResults,
                              status: action.payload.status,
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
