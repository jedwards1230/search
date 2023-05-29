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
