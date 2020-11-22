import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

let _start = Joi.ref('_start');

let newPaginationShema = {
	_start: Joi.number().min(0).optional(),
	_end: Joi.number().min(_start).when('_start', {
		is: Joi.number().not().exist(),
		then: Joi.required(),
	}),
};

let validator = createValidator({ passError: true });
export const PaginationValidations = validator.query(Joi.object(newPaginationShema));
