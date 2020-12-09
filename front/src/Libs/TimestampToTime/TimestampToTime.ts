export default function timestampToTime(timestamp: number): string {
  if (!timestamp || timestamp < 0) return '00:00:00';
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor((timestamp % 3600) % 60);
  return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
}
