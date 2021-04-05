import './DiceTimer.scss';
import { IDiceFaceTime } from '../../../Services/Redux/ducks/dice.ducks';
import DonutTimer from '../../Molecules/DonutTimer/DonutTimer';
import useSinceDate from '../../../Hooks/Organisms/useSinceDate';
import Loader from '../../Atoms/Loader';
// import useSinceClock from '../../Hooks/useSinceClock';

export default function DiceTimer({
  current,
  isLoading,
  onUpdate,
  onStart,
}: {
  current: IDiceFaceTime | undefined;
  isLoading: boolean;
  // eslint-disable-next-line
  onUpdate?: (current: IDiceFaceTime) => void;
  onStart?: () => void;
}) {
  const sinceDate = useSinceDate(current?.start);
  return (
    <div className="DiceTimer">
      <DonutTimer backgroundColor="#0000000a" startDate={current?.start} color={current?.face?.color}>
        {current ? (
          <div className="DiceTimer__content">
            <div className="DiceTimer__content__timer" style={{ color: current?.face.color }}>
              {sinceDate}
            </div>
            <div className="DiceTimer__content__name" style={{ color: current?.face.color }}>
              {current?.face.name}
            </div>
            {isLoading ? (
              <div className="DiceTimer__content__loader">
                <Loader size="15px" />
              </div>
            ) : (
              <div className="DiceTimer__content__update clickable" onClick={() => onUpdate!(current)}>
                Modifier
              </div>
            )}
          </div>
        ) : (
          <div className="DiceTimer__content">
            <div>Pas d&apos;activité en cours</div>
            <div className="DiceTimer__content__update clickable" onClick={() => onStart!()}>
              Démarrer
            </div>
            {isLoading && (
              <div className="DiceTimer__content__loader">
                <Loader size="15px" />
              </div>
            )}
          </div>
        )}
      </DonutTimer>
    </div>
  );
}

DiceTimer.defaultProps = {
  onUpdate: () => {},
  onStart: () => {},
};
