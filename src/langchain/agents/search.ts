import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
import { WebBrowser } from 'langchain/tools/webbrowser';
import { CustomHandler } from '../utils';

export default async function searchExecutor() {
    const handler = new CustomHandler();
    const model = new ChatOpenAI({ temperature: 0 });
    const embeddings = new OpenAIEmbeddings();
    const tools = [
        //new GoogleSnippets(),
        new Calculator(),
        new WebBrowser({ model, embeddings }),
        //new Summarizer(),
    ];
    const searchExecutor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
            agentType: 'chat-zero-shot-react-description',
            agentArgs: {
                callbacks: [handler],
                //suffix: 'use markdown format. provide relevant links to this query:',
            },
            returnIntermediateSteps: true,
            maxIterations: 2,
            verbose: true,
            callbacks: [handler],
        }
    );

    return searchExecutor;
}
