import IO from 'socket.io';
import http from 'http';
import logguer from 'basic-log';
import SocketSystem from '../../libs/SocketActions/SocketSystem';

export default class SocketServeur {
	static shared = new SocketServeur();
	private ioPrv: IO.Server;
	listeners: IO.Server[] = [];

	get io(): IO.Server {
		return this.ioPrv;
	}

	start(http: http.Server) {
		this.ioPrv = IO(http);
		this.ioPrv.origins('*:*');
		this.initListenning(this.ioPrv);
	}

	private initListenning(io: IO.Server) {
		this.listenningConnect(io);
	}

	private listenningConnect(io: IO.Server) {
		logguer.i('Starting listenning for new socket connection');
		io.on('connection', (listener: IO.Server) => {
			this.listeners.push(listener);
			SocketSystem.init(listener);
			logguer.i(`Listenner connected ! total : ${this.listeners.length}`);
			listener.on('disconnect', () => {
				this.listeners = this.listeners.filter((e) => e !== listener);
				logguer.i(`Listenner disconnected ! total : ${this.listeners.length}`);
			});
		});
	}
}
