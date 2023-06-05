interface IntermediateStep {
    action: {
        tool: string;
        toolInput: string;
        log: string;
    };
    observation: SearchResult[];
}

interface SearchResult {
    url: string;
    snippet: string;
    title: string;
    content?: string;
    error?: string;
}

type Model = 'gpt-3.5-turbo' | 'gpt-4';

type ResultStatus = 'Getting links' | 'Scraping links' | 'Summarizing' | 'Done';

type Result = {
    id: number;
    query: string;
    summary: string;
    references: SearchResult[];
    model: Model;
    finished: boolean;
    status: ResultStatus;
};

type Action =
    | { type: 'ADD_RESULT'; payload: Result }
    | { type: 'FINISH'; payload: number }
    | { type: 'RESET' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'TOGGLE_HIDE_REFERENCES' }
    | { type: 'UPDATE_MODEL'; payload: Model }
    | {
          type: 'UPDATE_SEARCH_RESULTS';
          payload: {
              id: number;
              searchResults: SearchResult[];
              status: ResultStatus;
          };
      }
    | {
          type: 'UPDATE_SUMMARY';
          payload: { id: number; summary: string };
      };

type State = {
    loading: boolean;
    results: Result[];
    model: Model;
    hideReferences: boolean;
    toggleReferences: () => void;
    processQuery: (newInput: string, updateUrl?: boolean) => void;
    reset: () => void;
    setModel: (model: Model) => void;
};
