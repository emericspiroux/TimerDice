import useSinceClock from '../Atoms/useSinceClock';

export default function useSinceDate(startDate: Date | undefined): string {
  const sinceSeconds = useSinceClock(startDate);

  function format() {
    if (!sinceSeconds || sinceSeconds < 0) return '00:00:00';
    const hours = Math.floor(sinceSeconds / 3600);
    const minutes = Math.floor((sinceSeconds % 3600) / 60);
    const seconds = Math.floor((sinceSeconds % 3600) % 60);
    return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(
      -2,
    )}:${`0${seconds}`.slice(-2)}`;
  }

  return format();
}
