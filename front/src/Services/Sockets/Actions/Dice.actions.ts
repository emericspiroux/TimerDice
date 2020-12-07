import _ from 'lodash';
import { setDice } from '../../Redux/ducks';
import { getCalendar } from '../../Redux/ducks/calendar.ducks';
import { IDiceFaceTime, removeDice } from '../../Redux/ducks/dice.ducks';
import SocketAction from '../SocketAction';

export default class DiceAction extends SocketAction {
  startListenning() {
    this.addListeningDiceFaceTimeStart();
    this.addListeningDiceFaceTimeStop();
  }

  stopListenning() {
    this.removeListeningDiceFaceTimeStart();
    this.removeListeningDiceFaceTimeStop();
  }

  private addListeningDiceFaceTimeStart() {
    this.socket.on('dice.start', (dice: IDiceFaceTime) => {
      this.store.dispatch(setDice(dice));
    });
  }

  private addListeningDiceFaceTimeStop() {
    this.socket.on('dice.stop', () => {
      this.store.dispatch(removeDice());
      _.get(this.state, 'calendar.startDate');
      console.log(
        "🚀 ~ file: Dice.actions.ts ~ line 28 ~ DiceAction ~ this.socket.on ~ _.get(this.state, 'calendar.startDate')",
        _.get(this.state, 'calendar.startDate'),
      );
      console.log(
        "🚀 ~ file: Dice.actions.ts ~ line 28 ~ DiceAction ~ this.socket.on ~ _.get(this.state, 'calendar.startDate')",
        _.get(this.state, 'calendar.endDate'),
      );
      this.store.dispatch(
        getCalendar(
          _.get(this.state, 'calendar.startDate'),
          _.get(this.state, 'calendar.endDate'),
        ),
      );
    });
  }

  private removeListeningDiceFaceTimeStart() {
    this.socket.off('dice.start');
  }

  private removeListeningDiceFaceTimeStop() {
    this.socket.off('dice.stop');
  }
}
