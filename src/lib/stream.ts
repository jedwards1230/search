export async function readStream(
    stream: ReadableStream,
    chunkCallback: Function
) {
    const reader = stream.getReader();
    let accumulatedResponse = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
            const decoded = new TextDecoder().decode(value);
            accumulatedResponse += decoded;
            chunkCallback(decoded);
        }
    }
}
