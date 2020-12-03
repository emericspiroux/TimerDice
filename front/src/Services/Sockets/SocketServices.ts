import { Store } from 'redux';
import SocketIOClient from 'socket.io-client';

class SocketServices {
  static shared: SocketServices = new SocketServices();

  private store?: Store;

  private socketPrv: SocketIOClient.Socket;

  constructor() {
    this.socketPrv = SocketIOClient(process.env.REACT_APP_WEBSOCKET_URL || '', {});
  }

  get socket(): SocketIOClient.Socket {
    return this.socketPrv;
  }

  setStore(store: Store) {
    this.store = store;
  }

  get state() {
    const state = this.store!.getState();
    return state;
  }

  // addListennerCheckUpdate() {
  //   this.socketPrv.on("checkUpdate", () => {
  //     this.store!.dispatch(checkSystemUpdate());
  //   });
  // }

  // removeListennerCheckUpdate() {
  //   this.socketPrv.off("checkUpdate");
  // }

  // loginOtherDevices(token: any) {
  //   this.socketPrv.emit("login", token);
  // }
}

export default SocketServices;
