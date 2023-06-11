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
    | { type: 'REVERT_TO_RESULT'; payload: Result }
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

type Keys = {
    openaiApiKey?: string | null | undefined;
    googleApiKey?: string | null | undefined;
    googleCseApiKey?: string | null | undefined;
};

type Config = {
    model: Model;
    hideReferences: boolean;
    summarizeReferences: boolean;
    serverSideKeys?: boolean;
    keys?: Keys | null;
};

type State = {
    loading: boolean;
    results: Result[];
    processQuery: (
        newInput: string,
        context?: string,
        updateUrl?: boolean,
        quickSearch?: boolean,
        idToUpdate?: number
    ) => void;
    reset: () => void;
    config: Config;
    updateConfig: (config: Config) => void;
};
