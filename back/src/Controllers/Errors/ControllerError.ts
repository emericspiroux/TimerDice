export default class ControllerError extends Error {
	status: number;
	details: any;

	constructor(status: number, message?: string, stack?: string, details?: any) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.message = message || 'Something went wrong. Please try again.';

		this.status = status || 500;

		try {
			this.details = JSON.parse(stack);
		} catch {
			this.details = stack;
		}
		if (details) this.details = details;
	}
}

export class MissingParameterControllerError extends ControllerError {
	constructor() {
		super(400, 'Missing Parameters');
	}
}
