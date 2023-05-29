import { LLMChain } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

const chat = new ChatOpenAI({
    temperature: 0,
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token: string) {
                console.log(token);
            },
        },
    ],
});
const summarizePrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "Thoroughly answer the user's query based on the search results. " +
            'Respond in markdown format. ' +
            'Ensure sources are cited with markdown links. ' +
            'Ensure all links are simplified with markdown links. '
    ),
    HumanMessagePromptTemplate.fromTemplate(
        'User query: {query}. Search Results: {results}'
    ),
]);

const summarizeChain = new LLMChain({
    prompt: summarizePrompt,
    llm: chat,
});

export default summarizeChain;
