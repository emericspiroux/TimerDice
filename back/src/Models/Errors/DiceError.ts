import ModelError from './ModelError';

export class NoCurrentDiceError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'no_current', 'No current face time started');
	}
}

export class WrongStartEndDiceError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'dice_wrong_start_end', 'End date must be after start date');
	}
}

export class WrongFaceDiceError extends ModelError {
	constructor(modelName: string, face: number) {
		super(modelName, 404, 'dice_wrong_face', `Face #${face} not found`);
	}
}
