import ModelError from './ModelError';

export class AlreadyStartedCurrentDiceError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 400, 'has_already_current', 'Please stop current before starting new one');
	}
}

export class NoCurrentDiceError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'no_current', 'No current face time started');
	}
}

export class DiceFaceNotFoundError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'face_no_found', 'Face object not found');
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
