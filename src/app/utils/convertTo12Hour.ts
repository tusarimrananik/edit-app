export default function convertTo12Hour(time: string) { return ((h => `${h % 12 || 12}:${time.split(':')[1]}`)(+time.split(':')[0])); }
