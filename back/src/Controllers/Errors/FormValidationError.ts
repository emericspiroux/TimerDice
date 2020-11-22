import ControllerError from './ControllerError';

export default class FormValidationError extends ControllerError {
	constructor(errors: any[]) {
		super(400, 'Parameters error', null, errors);
	}
}
