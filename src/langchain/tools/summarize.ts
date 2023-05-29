import { Tool } from 'langchain/tools';
import { OpenAI } from 'langchain/llms/openai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export class Summarizer extends Tool {
    name = 'Summarizer';

    description =
        'a tool to review and summarize search results. this MUST be used. input should include the search query and the results. outputs a string.';

    async _call(input: string) {
        const model = new OpenAI({ temperature: 0 });
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
        });
        const docs = await textSplitter.createDocuments([input]);

        const chain = loadSummarizationChain(model, { type: 'map_reduce' });
        const res = await chain.call({ input_documents: docs });
        return res.text;
    }
}
