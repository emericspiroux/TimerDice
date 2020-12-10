import { IDiceFaceTimeRangeElement } from '../../Services/Redux/ducks/data.ducks';

export default function DurationTotalCount(events: IDiceFaceTimeRangeElement[]): number {
  return events.reduce(
    /* eslint-disable-next-line no-unused-vars */
    (accumulator: number, rangeEvent: IDiceFaceTimeRangeElement) => accumulator + rangeEvent.duration,
    0,
  );
}
