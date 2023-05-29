import { Tool } from 'langchain/tools';
import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

/* export interface GoogleCustomSearchParams {
	apiKey?: string;
	googleCSEId?: string;
} */

export class Summarizer extends Tool {
    name = 'Summarizer';

    /* protected apiKey: string;

	protected googleCSEId: string; */

    description =
        'a custom search engine. useful for when you need to answer questions about current events. input should be a search query. outputs a JSON array of results.';

    /* constructor(fields: GoogleCustomSearchParams = {}) {
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
	} */

    async _call(input: string) {
        const model = new OpenAI({ temperature: 0 });
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });
        const docs = await textSplitter.createDocuments([input]);

        const chain = loadSummarizationChain(model, { type: 'map_reduce' });
        const res = await chain.call({ input_documents: docs });
        return res.text;

        /* const res = await fetch(
			`https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${
				this.googleCSEId
			}&q=${encodeURIComponent(input)}`
		);

		if (!res.ok) {
			throw new Error(
				`Got ${res.status} error from Google custom search: ${res.statusText}`
			);
		}

		const json = await res.json();

		const results =
			json?.items?.map(
				(item: {
					title?: string;
					link?: string;
					snippet?: string;
				}) => ({
					title: item.title,
					link: item.link,
					snippet: item.snippet,
				})
			) ?? [];
		return JSON.stringify(results); */
    }
}
