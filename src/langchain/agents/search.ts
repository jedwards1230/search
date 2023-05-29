import { ChatOpenAI } from 'langchain/chat_models/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
import { CustomHandler } from '../utils';
import { GoogleCustomSearch } from '../tools/googleSearch';

export default async function searchExecutor() {
    const handler = new CustomHandler();
    const model = new ChatOpenAI({ temperature: 0, callbacks: [handler] });
    const tools = [new GoogleCustomSearch(), new Calculator()];
    const searchExecutor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
            agentType: 'chat-zero-shot-react-description',
            returnIntermediateSteps: true,
            verbose: true,
            callbacks: [handler],
        }
    );

    return searchExecutor;
}
