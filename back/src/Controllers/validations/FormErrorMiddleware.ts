import { NextFunction, Response, Request } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import FormValidationError from '../Errors/FormValidationError';
import logguer from 'basic-log';

export default function FormErrorMiddleware(err: ExpressJoiError, req: Request, res: Response, next: NextFunction) {
	if (err.error) {
		logguer.e(err);
		return next(
			new FormValidationError(err.error!.details.map((e) => ({ message: e.message, label: e.context!.label })))
		);
	}
	next();
}
