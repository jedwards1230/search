import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

const resolvePrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        'Extract and organize all the data in the following search results. ' +
            'Do not keep links or redundant titles. ' +
            'Only the facts and data are needed. '
    ),
    HumanMessagePromptTemplate.fromTemplate('{input}'),
]);

const summaryChain = new ConversationChain({
    prompt: resolvePrompt,
    llm: new ChatOpenAI({
        temperature: 0,
    }),
});

export default summaryChain;
