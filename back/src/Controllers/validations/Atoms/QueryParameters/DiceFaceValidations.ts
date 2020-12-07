import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const schema = {
	face: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8).optional(),
};

const validator = createValidator({ passError: true });
export const DiceFaceValidations = validator.query(Joi.object(schema));
