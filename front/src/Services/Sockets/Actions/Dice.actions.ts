import { setDice } from '../../Redux/ducks';
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
    });
  }

  private removeListeningDiceFaceTimeStart() {
    this.socket.off('dice.start');
  }

  private removeListeningDiceFaceTimeStop() {
    this.socket.off('dice.stop');
  }
}