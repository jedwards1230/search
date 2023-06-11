import { AIChatMessage, HumanChatMessage } from 'langchain/schema';

export function resultsToChatMessages(results: Result[]) {
    const messages: (HumanChatMessage | AIChatMessage)[] = [];
    for (const result of results) {
        messages.push(
            new HumanChatMessage(
                result.context
                    ? `${result.query}\n\nUser provided context:\n${result.context}`
                    : result.query
            )
        );
        messages.push(new AIChatMessage(result.summary));
    }
    return messages;
}
