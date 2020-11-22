export default class ModelError extends Error {
	status: number;
	details: object | string;
	model: string;

	constructor(modelName: string, status: number, message?: string, stack?: string) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.model = modelName;
		this.message = message || 'Something went wrong. Please try again.';

		this.status = status || 500;

		try {
			this.details = JSON.parse(stack);
		} catch {
			this.details = stack;
		}
	}
}

export class NotFoundElement extends ModelError {
	constructor(modelName: string) {
		super(modelName, 404, 'Element not found');
	}
}
