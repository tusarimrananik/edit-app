export const generateFutureTime = (futureTime: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + futureTime);
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};