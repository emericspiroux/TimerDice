import DiceObject from '../DiceObject/DiceObject';
import { DiceOnChangePosition } from '../Types/Dice.types';
import DiceBLE from './DiceBLE';
import logguer from 'basic-log';

export default class DiceEngine {
	static shared = new DiceEngine();
	private ble: DiceBLE;

	constructor() {
		this.ble = new DiceBLE();
	}

	start(onChange: DiceOnChangePosition) {
		logguer.d('Start DiceEngine');
		this.ble.setOnDetectDice(onChange);
		this.ble.start('TimerDice');
	}

	stop() {
		this.ble.stop();
	}
}
