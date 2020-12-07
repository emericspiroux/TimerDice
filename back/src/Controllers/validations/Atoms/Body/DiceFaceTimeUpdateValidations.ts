import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

let start = Joi.ref('start');

export const schema = {
	description: Joi.string().optional(),
	faceId: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8).optional(),
	start: Joi.date().optional(),
	end: Joi.date().optional(),
};

const validator = createValidator({ passError: true });
export const DiceFaceTimeUpdateBodyValidations = validator.body(Joi.object(schema));
