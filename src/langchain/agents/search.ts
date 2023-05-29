import { ChatOpenAI } from 'langchain/chat_models/openai';
//import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
//import { WebBrowser } from 'langchain/tools/webbrowser';
import { CustomHandler } from '../utils';
import { GoogleCustomSearch } from '../tools/googleSearch';
import { PromptTemplate } from 'langchain';

export default async function searchExecutor() {
    const handler = new CustomHandler();
    const model = new ChatOpenAI({ temperature: 0, callbacks: [handler] });
    //const embeddings = new OpenAIEmbeddings();
    const tools = [
        new GoogleCustomSearch(),
        new Calculator(),
        //new WebBrowser({ model, embeddings }),
        //new Summarizer(),
    ];
    const searchExecutor = await initializeAgentExecutorWithOptions(
        tools,
        model,
        {
            agentType: 'chat-zero-shot-react-description',
            agentArgs: {
                //callbacks: [handler],
                suffix: 'use markdown format. provide relevant links to this query:',
            },
            returnIntermediateSteps: true,
            verbose: true,
            //callbacks: [handler],
        }
    );

    return searchExecutor;
}

const promptB = PromptTemplate.fromTemplate(
    'Provide relevant links to this query: {query}?'
);

export async function buildSearchPrompt(query: string) {
    return await promptB.format({ query });
}
