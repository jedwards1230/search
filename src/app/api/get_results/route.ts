import { NextResponse } from "next/server";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { GoogleCustomSearch } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export async function POST(request: Request) {
	const res = await request.json();
	const query = res.query;

	const model = new ChatOpenAI({ temperature: 0 });
	const tools = [new GoogleCustomSearch(), new Calculator()];

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: "chat-zero-shot-react-description",
		returnIntermediateSteps: true,
		verbose: true,
	});

	const response = await executor.call({ input: query });

	//console.log(response);

	const results = response.output;
	const intermediateSteps = response.intermediateSteps;

	return NextResponse.json({ results, intermediateSteps });
}
