interface IntermediateStep {
	action: {
		tool: string;
		toolInput: string;
		log: string;
	};
	observation: {
		link: string;
		snippet: string;
		title: string;
	}[];
}
