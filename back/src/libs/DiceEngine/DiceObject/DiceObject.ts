import { DiceOnChangePosition } from '../Types/Dice.types';

export default class DiceObject {
	private prvId?: string;
	private x: number;
	private y: number;
	private z: number;
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
