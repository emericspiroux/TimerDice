import logguer from 'basic-log';
import { exec } from 'child_process';
import SocketServeur from '../../Serveur/Sockets/SockerServeur';

export default class SocketSystem {
	static init(listener: SocketIO.Server) {
		SocketSystem.log(listener);
	}

	static log(listener: SocketIO.Server) {
		listener.on('logError', (log) => {
			logguer.e('SocketSystem -> log -> Error :', log);
		});

		listener.on('logInfo', (log) => {
			logguer.i('SocketSystem -> log -> Info :', log);
		});
	}

	static fireCheckUpdate() {
		logguer.d('SocketAlarm -> fireCheckUpdate');
		SocketServeur.shared.io.emit('checkUpdate');
	}
}
