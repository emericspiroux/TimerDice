import _ from 'lodash';
import { setDice } from '../../Redux/ducks';
import { getCalendar } from '../../Redux/ducks/calendar.ducks';
import { IDiceFace, IDiceFaceTime, removeDice } from '../../Redux/ducks/dice.ducks';
import SocketAction from '../SocketAction';

export default class DiceAction extends SocketAction {
  startListenning() {
    this.addListeningDiceFaceTimeStart();
    this.addListeningDiceFaceTimeStop();
    this.addListeningSetting();
  }

  stopListenning() {
    this.removeListeningDiceFaceTimeStart();
    this.removeListeningDiceFaceTimeStop();
    this.removeListeningSetting();
  }

  changeSettingsState(isDisabled: boolean) {
    this.socket.emit('dice.disable', isDisabled);
  }

  private addListeningDiceFaceTimeStart() {
    this.socket.on('dice.start', (dice: IDiceFaceTime) => {
      this.store.dispatch(setDice(dice));
    });
  }

  private addListeningDiceFaceTimeStop() {
    this.socket.on('dice.stop', () => {
      this.store.dispatch(removeDice());
      this.store.dispatch(getCalendar(_.get(this.state, 'calendar.startDate'), _.get(this.state, 'calendar.endDate')));
    });
  }

  private removeListeningDiceFaceTimeStart() {
    this.socket.off('dice.start');
  }

  private removeListeningDiceFaceTimeStop() {
    this.socket.off('dice.stop');
  }

  private addListeningSetting() {
    this.socket.on('dice.setting', (face: IDiceFace) => {
      console.log('Face :', face);
    });
  }

  private removeListeningSetting() {
    this.socket.off('dice.setting');
  }
}
