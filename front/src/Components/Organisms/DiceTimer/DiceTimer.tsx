import './DiceTimer.scss';
import { IDiceFaceTime } from '../../../Services/Redux/ducks/dice.ducks';
import DonutTimer from '../../Molecules/DonutTimer/DonutTimer';
import useSinceDate from '../../../Hooks/Organisms/useSinceDate';
// import useSinceClock from '../../Hooks/useSinceClock';

export default function DiceTimer({
  current,
}: {
  current: IDiceFaceTime | undefined;
}) {
  const sinceDate = useSinceDate(current?.start);
  return (
    <div className="DiceTimer">
      <DonutTimer
        backgroundColor="#0000000a"
        startDate={current?.start}
        color={current?.face.color}
      >
        {current ? (
          <div className="DiceTimer__content">
            <div
              className="DiceTimer__content__timer"
              style={{ color: current?.face.color }}
            >
              {sinceDate}
            </div>
            <div
              className="DiceTimer__content__name"
              style={{ color: current?.face.color }}
            >
              {current?.face.name}
            </div>
          </div>
        ) : (
          "Pas d'activité en cours"
        )}
      </DonutTimer>
    </div>
  );
}
