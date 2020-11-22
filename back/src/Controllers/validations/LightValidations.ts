import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

const newShema = {
	level: Joi.number().min(1).max(255).required(),
};

let validator = createValidator({ passError: true });
export const LightValidations = validator.body(Joi.object(newShema));
