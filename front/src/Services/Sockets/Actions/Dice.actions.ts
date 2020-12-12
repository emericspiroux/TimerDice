import _ from 'lodash';
import { setDice } from '../../Redux/ducks';
import { getCalendar } from '../../Redux/ducks/calendar.ducks';
import { IDiceFace, IDiceFaceTime, removeDice } from '../../Redux/ducks/dice.ducks';
import { setDiceSettings } from '../../Redux/ducks/settings.ducks';
import SocketAction from '../SocketAction';

export default class DiceAction extends SocketAction {
  startListenning() {
    this.addListeningDetectSetting();
    this.addListeningDiceFaceTimeStart();
    this.addListeningDiceFaceTimeStop();
    this.addListeningSetting();
  }

  stopListenning() {
    this.removeListeningDiceFaceTimeStart();
    this.removeListeningDiceFaceTimeStop();
    this.removeListeningSetting();
    this.removeListeningDetectSetting();
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
      this.store.dispatch(setDiceSettings(face));
    });
  }

  private removeListeningSetting() {
    this.socket.off('dice.setting');
  }

  private addListeningDetectSetting() {
    this.socket.on('dice.setting.detect', () => {
      if (window.location.pathname === '/settings') this.changeSettingsState(true);
    });
  }

  private removeListeningDetectSetting() {
    this.socket.off('dice.setting.detect');
  }
}
