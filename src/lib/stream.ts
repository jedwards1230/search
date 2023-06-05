export async function readStream(
    stream: ReadableStream,
    chunkCallback: (token: string) => void,
    endCallback?: (content: string) => void
) {
    const reader = stream.getReader();
    let accumulatedResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
            const decoded = new TextDecoder().decode(value);
            if (decoded === 'LLM_END' && endCallback) {
                endCallback(accumulatedResponse);
            } else {
                accumulatedResponse += decoded;
                chunkCallback(accumulatedResponse);
            }
        }
    }
}
