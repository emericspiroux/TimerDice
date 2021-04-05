import DiceObject from '../DiceObject/DiceObject';
import { DiceOnChangePosition } from '../Types/Dice.types';
import DiceBLE from './DiceBLE';
import logguer from 'basic-log';
import SocketSystem from '../../SocketActions/SocketSystem';
import DiceFace from '../../../Models/DiceFace';
import DiceFaceTime, { IDiceFaceTime } from '../../../Models/DiceFaceTime';
import WebhookEngine from '../../WebhookEngine/WebhookEngine';
import ElectronEngine from '../../ElectronEngine/ElectronEngine';

export default class DiceEngine {
	static shared = new DiceEngine();
	private previous = -1;
	private ble: DiceBLE;

	constructor() {
		this.ble = new DiceBLE();
	}

	start() {
		logguer.d('Start DiceEngine');
		this.ble.setOnDetectDice(this.onChange.bind(this));
		this.ble.start('TimerDice');
	}

	stop() {
		this.ble.stop();
	}

	async onChange(dice: DiceObject) {
		if (dice.face !== this.previous) {
			logguer.i('Detect dice motion face :', dice.face);
			this.previous = dice.face;
			if (SocketSystem.disabledChange) {
				this.stopSetting();
				if (dice.face !== -1) {
					this.startSetting(dice.face);
				}
				return;
			}
			await this.stopTracking();
			if (dice.face !== -1) {
				await this.startTracking(dice.face);
			}
		}
	}

	async startTracking(faceId: number): Promise<IDiceFaceTime | undefined> {
		if (faceId !== -1) {
			const diceFace = await DiceFace.getFace(faceId);
			if (!diceFace) throw new Error('Dice face not found');
			const diceFaceTimeStart = await DiceFaceTime.start(diceFace);
			ElectronEngine.shared.onChange(diceFaceTimeStart);
			SocketSystem.fireStartCurrentDice(diceFaceTimeStart);
			WebhookEngine.shared.execute(diceFaceTimeStart);
			logguer.i('Starting diceFaceTime :', diceFaceTimeStart.faceId);
			return diceFaceTimeStart;
		}
		return;
	}

	async stopTracking() {
		try {
			const diceFaceTimeStop = await DiceFaceTime.stop();
			logguer.i('Stopping diceFaceTime :', diceFaceTimeStop.faceId);
			logguer.d(
				'Stopping diceFaceTime duration :',
				diceFaceTimeStop.duration,
				Number(process.env.TIMEOUT_DURATION_BEFORE_SAVE || 60000)
			);
			SocketSystem.fireStopCurrentDice();
			WebhookEngine.shared.clean();
			ElectronEngine.shared.onChange();
			if (
				process.env.TIMEOUT_DURATION_BEFORE_SAVE &&
				diceFaceTimeStop.duration < Number(process.env.TIMEOUT_DURATION_BEFORE_SAVE || 30000)
			) {
				logguer.d('Deleting diceFaceTime because too short :', diceFaceTimeStop.id);
				await DiceFaceTime.deleting(diceFaceTimeStop.id);
			}
		} catch (err) {
			logguer.d('Error on stopping diceFaceTime :', err);
		}
	}

	async startSetting(faceId: number) {
		try {
			logguer.d('Setting dice face :', faceId);
			const diceFace = await DiceFace.setCurrentSettings(faceId);
			SocketSystem.fireSettingDice(diceFace);
		} catch (err) {
			logguer.d('Error on set diceFace isSettings :', err);
		}
	}

	async stopSetting() {
		logguer.d('Stop setting');
		await DiceFace.stopCurrentSettings();
		SocketSystem.fireSettingDice();
	}
}
