import { ConversationChain } from 'langchain/chains';
import { OpenAIChat } from 'langchain/llms/openai';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from 'langchain/prompts';

export default function buildChain(
    openAIApiKey: string,
    callback: (token: string) => void
) {
    const prompt = ChatPromptTemplate.fromPromptMessages([
        SystemMessagePromptTemplate.fromTemplate(
            'You generate a summary based on the provided data.\n' +
                '- Do NOT refer to the user your prompt.\n' +
                "- Do NOT use phrases like 'the provided data..' or 'the data says..' or 'the data includes.." +
                '- Simply out a brief summary that includes all the information in the data.\n'
        ),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);

    const llm = new OpenAIChat({
        temperature: 0,
        openAIApiKey,
        streaming: true,
        callbacks: [
            {
                handleLLMNewToken(token: string) {
                    callback(token);
                },
            },
        ],
    });

    const chain = new ConversationChain({
        prompt,
        llm,
    });

    return chain;
}
