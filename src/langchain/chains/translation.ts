import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

const chat = new ChatOpenAI({ temperature: 0 });
const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'You translate messages, issues, and questions into 1 recommended search query for a search engine like google or bing. ' +
            'Do not provide any information that can be used to identify the user. ' +
            'Do not provide any text other than the search query. ' +
            'Do not use any special characters unless necessary. Avoid qutoes.'
    ),
    HumanMessagePromptTemplate.fromTemplate('{message}'),
]);

const translationChain = new LLMChain({
    prompt: translationPrompt,
    llm: chat,
});

export default translationChain;
