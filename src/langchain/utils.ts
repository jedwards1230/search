import {
    AgentAction,
    AgentFinish,
    ChainValues,
    LLMResult,
} from 'langchain/dist/schema';
import { BaseCallbackHandler } from 'langchain/callbacks';

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

export async function searchGoogle(input: string) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const googleCSEId = process.env.GOOGLE_CSE_ID;

    const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${googleCSEId}&q=${encodeURIComponent(
            input
        )}`
    );

    if (!res.ok) {
        throw new Error(
            `Got ${res.status} error from Google custom search: ${res.statusText}`
        );
    }

    const json = await res.json();

    const results =
        json?.items?.map(
            (item: { title?: string; link?: string; snippet?: string }) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
            })
        ) ?? [];
    return JSON.stringify(results);
}
