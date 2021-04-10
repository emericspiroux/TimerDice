import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

let start = Joi.ref('start');

export const schema = {
	start: Joi.date().required(),
	end: Joi.date()
		.min(start)
		.when('start', {
			is: Joi.number().not().exist(),
			then: Joi.required(),
		})
		.required(),
};

const validator = createValidator({ passError: true });
export const TimeRangeBodyValidations = validator.body(Joi.object(schema));
