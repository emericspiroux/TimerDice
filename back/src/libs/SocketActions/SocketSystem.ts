import logguer from 'basic-log';
import { IDiceFace } from '../../Models/DiceFace';
import { IDiceFaceTime } from '../../Models/DiceFaceTime';
import SocketServeur from '../../Serveur/Sockets/SockerServeur';

export default class SocketSystem {
	static disabledChange = false;

	static init(listener: SocketIO.Server) {
		SocketSystem.log(listener);
		SocketSystem.onDisableChange(listener);
		SocketSystem.askForSettingsState();
	}

	static onDisableChange(listener: SocketIO.Server) {
		listener.on('dice.disable', (isDisabled: boolean) => {
			logguer.d('change disable dice timer :', isDisabled);
			SocketSystem.disabledChange = isDisabled;
		});
	}

	static log(listener: SocketIO.Server) {
		listener.on('logError', (log) => {
			logguer.e('SocketSystem -> log -> Error :', log);
		});

		listener.on('logInfo', (log) => {
			logguer.i('SocketSystem -> log -> Info :', log);
		});
	}

	static askForSettingsState() {
		logguer.d('Ask to listenner if settings state is set');
		SocketServeur.shared.io.emit('dice.setting.detect');
	}

	static fireSettingDice(dice?: IDiceFace) {
		SocketServeur.shared.io.emit('dice.setting', dice);
	}

	static fireCheckUpdate() {
		logguer.d('SocketAlarm -> fireCheckUpdate');
		SocketServeur.shared.io.emit('checkUpdate');
	}

	static fireStopCurrentDice() {
		SocketServeur.shared.io.emit('dice.stop');
	}

	static fireStartCurrentDice(current: IDiceFaceTime) {
		SocketServeur.shared.io.emit('dice.start', current);
	}
}
