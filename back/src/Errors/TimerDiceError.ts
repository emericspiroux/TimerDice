export default class TimerDiceError extends Error {
	status: number;
	details: object | string;
	code: string;

	constructor(status: number, code: string, message?: string, stack?: string) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.message = message || 'Something went wrong. Please try again.';
		this.code = code;
		this.status = status || 500;

		try {
			this.details = JSON.parse(stack);
		} catch {
			this.details = stack;
		}
	}
}
