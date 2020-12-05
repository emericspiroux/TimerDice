import { Store } from 'redux';
import SocketIOClient from 'socket.io-client';
import SocketAction from './SocketAction';

class SocketServices {
  static shared: SocketServices = new SocketServices();

  private store?: Store;

  private socketPrv: SocketIOClient.Socket;

  private actions: SocketAction[] = [];

  constructor() {
    this.socketPrv = SocketIOClient(process.env.REACT_APP_WEBSOCKET_URL || '', {});
  }

  get socket(): SocketIOClient.Socket {
    return this.socketPrv;
  }

  setStore(store: Store) {
    this.store = store;
  }

  setActions(actionsClass: Array<typeof SocketAction>) {
    actionsClass.forEach((ActionClass: typeof SocketAction) => {
      this.actions.push(new ActionClass(this.socketPrv, this.store!));
    });
  }

  // eslint-disable-next-line consistent-return
  getAction<T extends SocketAction>(ActionClass: typeof SocketAction): T {
    // eslint-disable-next-line no-restricted-syntax
    for (const action of this.actions) {
      if (action.className === ActionClass.className) return action as T;
    }
    const newAction = new ActionClass(this.socketPrv, this.store!);
    this.actions.push(newAction);
    return newAction as T;
  }

  get state() {
    const state = this.store!.getState();
    return state;
  }
}

export default SocketServices;
