interface IntermediateStep {
    action: {
        tool: string;
        toolInput: string;
        log: string;
    };
    observation: Observation[];
}

interface Observation {
    link: string;
    snippet: string;
    title: string;
}

type Model = 'gpt-3.5-turbo' | 'gpt-4';

type Result = {
    id: number;
    query: string;
    summary: string;
    references: Observation[];
    model: Model;
    finished: boolean;
};
