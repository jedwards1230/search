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
        console.log('token', { token });
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
