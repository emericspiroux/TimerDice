import SocketIOClient from 'socket.io-client';
import { Store } from 'redux';

export default class SocketAction {
  store: Store;

  socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket, store: Store) {
    this.socket = socket;
    this.store = store;
  }

  get state() {
    const state = this.store.getState();
    return state;
  }

  get className() {
    return this.constructor.name;
  }

  static get className() {
    return this.constructor.name;
  }

  startListenning() {
    /* eslint-disable-next-line no-console */
    console.error('Start Listenning is not define inside:', this.constructor.name);
  }

  stopListenning() {
    /* eslint-disable-next-line no-console */
    console.error('Stop Listenning is not define inside:', this.constructor.name);
  }
}
