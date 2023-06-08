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
    reviewed?: boolean;
    timeToComplete?: number;
}

type Model = 'gpt-3.5-turbo' | 'gpt-4';

type ResultStatus = 'Getting links' | 'Scraping links' | 'Summarizing' | 'Done';

type Result = {
    id: number;
    query: string;
    context?: string;
    summary: string;
    references: SearchResult[];
    model: Model;
    finished: boolean;
    status: ResultStatus;
    timeToComplete?: number;
};

type Action =
    | { type: 'ADD_RESULT'; payload: Result }
    | {
          type: 'FINISH';
          payload: {
              id: number;
              time: number;
          };
      }
    | { type: 'RESET' }
    | { type: 'SET_LOADING'; payload: boolean }
    | {
          type: 'UPDATE_SEARCH_RESULTS';
          payload: {
              id: number;
              searchResults: SearchResult[];
              status: ResultStatus;
          };
      }
    | {
          type: 'UPDATE_SEARCH_REFERENCE';
          payload: { id: number; reference: SearchResult };
      }
    | {
          type: 'UPDATE_SUMMARY';
          payload: { id: number; summary: string };
      };

type Config = {
    model: Model;
    hideReferences: boolean;
    openaiApiKey: string | null;
    googleApiKey: string | null;
    googleCseApiKey: string | null;
    summarizeReferences: boolean;
};

type State = {
    loading: boolean;
    results: Result[];
    processQuery: (
        newInput: string,
        context?: string,
        updateUrl?: boolean,
        quickSearch?: boolean
    ) => void;
    reset: () => void;
};
