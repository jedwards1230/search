export function formatTime(milliseconds: number) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes}min `;
    }
    if (seconds > 0) {
        formattedTime += `${seconds}s`;
    }

    return formattedTime.trim();
}
