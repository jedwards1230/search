import {
    AIChatMessage,
    AgentAction,
    AgentFinish,
    ChainValues,
    HumanChatMessage,
    LLMResult,
} from 'langchain/schema';
import { BaseCallbackHandler } from 'langchain/callbacks';
import supabase from '@/lib/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { Document } from 'langchain/document';

export class CustomHandler extends BaseCallbackHandler {
    name = 'custom_handler';

    handleLLMNewToken(token: string) {
        console.log('LLM new token', { token });
    }

    handleLLMStart(llm: { name: string }, _prompts: string[]) {
        console.log('handleLLMStart', { llm });
    }

    handleLLMEnd(object: LLMResult) {
        console.log('handleLLMEnd', {
            object: {
                generations: JSON.stringify(object.generations, null, 2),
                llmOutput: JSON.stringify(object.llmOutput, null, 2),
            },
        });
    }

    handleChainStart(chain: { name: string }, inputs: ChainValues) {
        console.log('handleChainStart', { chain, inputs });
    }

    handleChainEnd(chain: ChainValues) {
        console.log('handleChainEnd', { chain });
    }

    handleAgentAction(action: AgentAction) {
        console.log('handleAgentAction', action);
    }

    handleAgentEnd(action: AgentFinish) {
        console.log('handleAgentEnd', action);
    }

    handleToolStart(tool: { name: string }) {
        console.log('handleToolStart', { tool });
    }

    handleToolEnd(output: string) {
        console.log('handleToolEnd', { output });
    }
}

export async function searchGoogle(
    input: string,
    googleApiKey: string,
    googleCSEId: string
) {
    const apiKey = process.env.GOOGLE_API_KEY || googleApiKey;
    const CSEId = process.env.GOOGLE_CSE_ID || googleCSEId;

    if (!apiKey || !CSEId) {
        throw new Error(
            'Missing GOOGLE_API_KEY or GOOGLE_CSE_ID environment variables'
        );
    }

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('cx', CSEId);
    url.searchParams.set('q', input);
    url.searchParams.set('start', '1');

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(
            `Got ${res.status} error from Google custom search: ${res.statusText}`
        );
    }

    const json = await res.json();

    const results: SearchResult[] =
        json?.items?.map(
            (item: { title?: string; link?: string; snippet?: string }) => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet,
            })
        ) ?? [];
    return results;
}

export function resultsToChatMessages(results: Result[]) {
    const messages: (HumanChatMessage | AIChatMessage)[] = [];
    for (const result of results) {
        messages.push(new HumanChatMessage(result.query));
        messages.push(new AIChatMessage(result.summary));
    }
    return messages;
}

export async function getDocs(docs: Document[], query: string, key: string) {
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: key });
    const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: 'documents',
    });

    // add documents
    try {
        await vectorStore.addDocuments(docs);
    } catch (e) {
        console.error(e);
    }

    // find similar documents
    const results = await vectorStore.similaritySearch(query, 4);
    const content = results.map((res) => res.pageContent).join('\n');
}
