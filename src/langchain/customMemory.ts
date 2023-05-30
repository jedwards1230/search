import { BaseLanguageModel } from 'langchain/dist/base_language';
import { InputValues } from 'langchain/dist/schema';
import {
    BufferMemory,
    BufferMemoryInput,
    ConversationSummaryMemory,
} from 'langchain/memory';

class CombinedMemory extends BufferMemory {
    buffer = '';
    memoryKey = 'history';
    humanPrefix = 'Human';
    aiPrefix = 'AI';
    llm: BaseLanguageModel;

    constructor(fields: BufferMemoryInput, llm: BaseLanguageModel) {
        super({
            chatHistory: fields?.chatHistory,
            returnMessages: fields?.returnMessages ?? false,
            inputKey: fields?.inputKey,
            outputKey: fields?.outputKey,
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
        this.llm = llm;
    }

    async loadMemoryVariables(inputs: InputValues) {
        const bufferMemoryData = await super.loadMemoryVariables(inputs);
        const summaryMemory = new ConversationSummaryMemory({
            llm: this.llm,
        });

        const summaryMemoryData = await summaryMemory.loadMemoryVariables(
            inputs
        );
        return { ...bufferMemoryData, ...summaryMemoryData };
    }
}

export { CombinedMemory };
