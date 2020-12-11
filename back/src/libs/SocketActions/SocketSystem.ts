import logguer from 'basic-log';
import SocketServeur from '../../Serveur/Sockets/SockerServeur';

export default class SocketSystem {
	static disabledChange = false;

	static onDisableChange(listener: SocketIO.Server) {
		listener.on('dice.disable', (isDisabled: boolean) => {
			logguer.d('change disable dice timer :', isDisabled);
			SocketSystem.disabledChange = isDisabled;
		});
	}

	static init(listener: SocketIO.Server) {
		SocketSystem.log(listener);
		SocketSystem.onDisableChange(listener);
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
