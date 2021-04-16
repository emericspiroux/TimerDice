import DiceObject from '../DiceObject/DiceObject';
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

	start(override = false) {
		logguer.d('Start DiceEngine');
		this.seedFaceDefault(override);
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

	async seedFaceDefault(override = false) {
		if (override || !(await DiceFace.getFace(1))) {
			logguer.d('DiceFaces seeding...');
			const faceIds = [1, 2, 3, 4, 5, 6, 7, 8];
			const faceTitle = [
				'Code',
				'Code Review',
				'Réunion',
				'Read Documentation',
				'Help others',
				'Pause',
				'debug',
				'Write documentation',
			];
			const faceSlackStatus = [
				'En train de coder',
				'En pleine code review',
				'En Réunion, Ne pas déranger !',
				'Lit de le documentation',
				"Est en train d'aider des gens",
				'Est en pause',
				'Planche sur un bug',
				'Utilise sa plus belle plume',
			];
			const faceSlackEmoji = [
				':computer:',
				':open_book:',
				':date:',
				':newspaper:',
				':fire_engine:',
				':coffee:',
				':bug:',
				':memo:',
			];
			const faceColor = [
				'rgb(33, 150, 243)',
				'rgb(42, 188, 208)',
				'rgb(167, 215, 46)',
				'rgb(254, 215, 58)',
				'rgb(249, 185, 61)',
				'rgb(227, 44, 105)',
				'rgb(104, 62, 175)',
				'rgb(56, 64, 70)',
			];
			for (const [index, faceId] of faceIds.entries()) {
				const dice = await DiceFace.define(
					true,
					faceId,
					faceTitle[index] || `Face ${faceId}`,
					faceColor[index] || 'blue',
					{
						text: faceSlackStatus[index],
						emoji: faceSlackEmoji[index],
					}
				);
				logguer.d('DiceFaces define :', dice);
			}
		} else {
			logguer.d('DiceFaces already seeded.');
		}
		const settingDice = await DiceFace.getCurrentSettings();
		if (settingDice) {
			SocketSystem.fireSettingDice(settingDice);
		}
	}
}
