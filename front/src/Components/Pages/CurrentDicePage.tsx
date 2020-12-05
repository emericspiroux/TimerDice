import './CurrentDicePage.scss';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { IDiceFaceTime } from '../../Services/Redux/ducks/dice.ducks';
import DiceTimer from '../Organisms/DiceTimer/DiceTimer';

export default function CurrentDicePage() {
  const currentDice: IDiceFaceTime = useSelector<IDiceFaceTime>(
    (state: any): IDiceFaceTime => _.get(state, 'dice.current'),
  );
  return (
    <div className="CurrentDicePage">
      <DiceTimer current={currentDice} />
    </div>
  );
}
