import ModelError from './ModelError';

export default class NoCurrentDiceError extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'no_current', 'No current face time started');
	}
}
