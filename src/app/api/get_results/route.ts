import { NextResponse } from "next/server";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { GoogleCustomSearch } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import {
	AgentAction,
	AgentFinish,
	ChainValues,
	LLMResult,
} from "langchain/dist/schema";
import { BaseCallbackHandler } from "langchain/callbacks";

export const runtime = "edge";

export async function POST(request: Request) {
	const res = await request.json();
	const query = res.query;

	class CustomHandler extends BaseCallbackHandler {
		name = "custom_handler";

		handleLLMNewToken(token: string) {
			console.log("token", { token });
		}

		handleLLMStart(llm: { name: string }, _prompts: string[]) {
			console.log("handleLLMStart", { llm });
		}

		handleLLMEnd(object: LLMResult) {
			console.log("handleLLMEnd", {
				object: {
					generations: JSON.stringify(object.generations, null, 2),
					llmOutput: JSON.stringify(object.llmOutput, null, 2),
				},
			});
		}

		handleChainStart(chain: { name: string }, inputs: ChainValues) {
			console.log("handleChainStart", { chain, inputs });
		}

		handleChainEnd(chain: ChainValues) {
			console.log("handleChainEnd", { chain });
		}

		handleAgentAction(action: AgentAction) {
			console.log("handleAgentAction", action);
		}

		handleAgentEnd(action: AgentFinish) {
			console.log("handleAgentEnd", action);
		}

		handleToolStart(tool: { name: string }) {
			console.log("handleToolStart", { tool });
		}

		handleToolEnd(output: string) {
			console.log("handleToolEnd", { output });
		}
	}
	const handler = new CustomHandler();

	const model = new ChatOpenAI({ temperature: 0, callbacks: [handler] });
	const tools = [new GoogleCustomSearch(), new Calculator()];
	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: "chat-zero-shot-react-description",
		returnIntermediateSteps: true,
		verbose: true,
		callbacks: [handler],
	});

	const response = await executor.call({ input: query });
	const results = response.output;
	const intermediateSteps = response.intermediateSteps;

	return NextResponse.json({ results, intermediateSteps });
}
