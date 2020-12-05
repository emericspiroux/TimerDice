import useSinceClock from '../Atoms/useSinceClock';

export default function useSinceDate(startDate: Date | undefined): string {
  const sinceSeconds = useSinceClock(startDate);

  function format() {
    if (!sinceSeconds || sinceSeconds < 0) return '00:00:00';
    const seconds = (sinceSeconds % 60).toFixed(0);
    const minutes = ((sinceSeconds / 60) % 60).toFixed(0);
    const hour = (Number(minutes) / 60).toFixed(0);
    return `${`0${hour}`.slice(-2)}:${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(
      -2,
    )}`;
  }

  return format();
}
