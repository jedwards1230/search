import { Tool } from 'langchain/tools';
import { searchGoogle } from '../utils';

export interface GoogleCustomSearchParams {
    apiKey?: string;
    googleCSEId?: string;
}

export class GoogleSnippets extends Tool {
    name = 'google-snippets';

    protected apiKey: string;
    protected googleCSEId: string;

    description =
        'a search engine. ' +
        'useful for when you need quick answers to questions about current events. ' +
        'provides several links and relevant snippets. ' +
        'input should be a search query. ' +
        'outputs a JSON array of results.';

    constructor(
        fields: GoogleCustomSearchParams = {
            apiKey: process.env.GOOGLE_API_KEY,
            googleCSEId: process.env.GOOGLE_CSE_ID,
        }
    ) {
        super();
        if (!fields.apiKey) {
            throw new Error(
                `Google API key not set. You can set it as "GOOGLE_API_KEY" in your environment variables.`
            );
        }
        if (!fields.googleCSEId) {
            throw new Error(
                `Google custom search engine id not set. You can set it as "GOOGLE_CSE_ID" in your environment variables.`
            );
        }
        this.apiKey = fields.apiKey;
        this.googleCSEId = fields.googleCSEId;
    }

    async _call(input: string) {
        const res = await searchGoogle(input);

        return JSON.stringify(res);
    }
}
