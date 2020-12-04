import { DiceOnChangePosition } from '../Types/Dice.types';

export default class DiceObject {
	private prvId?: string;
	private prvIsOff = true;
	private x: number;
	private y: number;
	private z: number;
	private delta = 10;
	private createdAt: Date;
	private onChange: DiceOnChangePosition;

	constructor(id: string, position: string) {
		this.prvId = id;
		this.position = position;
		this.createdAt = new Date();
	}

	get id(): string {
		return this.prvId;
	}

	get isOff(): boolean {
		return this.prvIsOff;
	}

	insideDelta(value: number, middle: number, delta: number): boolean {
		let more = middle + delta;
		let minus = middle - delta;
		if (more > 360) {
			more = more - 360;
		}
		if (minus < 0) {
			minus = minus + 360;
		}
		if (more < minus) {
			return (more > value && value > 0) || (value < 360 && minus < value);
		}
		return more > value && minus < value;
	}

	get face() {
		this.prvIsOff = false;
		if (this.insideDelta(this.x, 40, this.delta) && this.insideDelta(this.z, 90, this.delta)) return 1;
		if (this.insideDelta(this.x, 360, this.delta) && this.insideDelta(this.z, 360, this.delta)) return 2;
		if (this.insideDelta(this.x, 315, this.delta) && this.insideDelta(this.z, 271, this.delta)) return 3;
		if (this.insideDelta(this.x, 360, this.delta) && this.insideDelta(this.z, 180, this.delta)) return 4;
		if (this.insideDelta(this.x, 178, this.delta) && this.insideDelta(this.z, 178, this.delta)) return 5;
		if (this.insideDelta(this.x, 135, this.delta) && this.insideDelta(this.z, 90, this.delta)) return 6;
		if (this.insideDelta(this.x, 175, this.delta) && this.insideDelta(this.z, 4, this.delta)) return 7;
		if (this.insideDelta(this.x, 220, this.delta) && this.insideDelta(this.z, 270, this.delta)) return 8;
		if (
			(this.insideDelta(this.x, 179, this.delta) && this.insideDelta(this.y, 180, this.delta)) ||
			(this.insideDelta(this.x, 360, this.delta) && this.insideDelta(this.y, 360, this.delta))
		) {
			this.prvIsOff = true;
		}
		return -1;
	}

	set position(positions: string) {
		let positionsArray = positions.split(':');
		if (positionsArray.length !== 3) {
			throw new Error('Position must be format like: X:Y:Z');
		}

		this.x = Number(positionsArray[0]);
		this.y = Number(positionsArray[1]);
		this.z = Number(positionsArray[2]);
	}
}
