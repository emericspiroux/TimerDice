import timestampToTime from '../../Libs/TimestampToTime/TimestampToTime';
import useSinceClock from '../Atoms/useSinceClock';

export default function useSinceDate(startDate: Date | undefined): string {
  const sinceSeconds = useSinceClock(startDate);
  return timestampToTime(sinceSeconds);
}
