import TimerDiceError from '../../Errors/TimerDiceError';

export default class ModelError extends TimerDiceError {
	status: number;
	details: object | string;
	model: string;
	code: string;

	constructor(modelName: string, status: number, code: string, message?: string, stack?: string) {
		super(status, code, message, stack);
		this.model = modelName;
	}
}

export class NotFoundElement extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'Element not found');
	}
}
