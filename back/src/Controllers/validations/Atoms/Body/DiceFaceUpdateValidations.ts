import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

let start = Joi.ref('start');

export const schema = {
	name: Joi.string().optional(),
	color: Joi.string().optional(),
	slackStatus: {
		emoji: Joi.string().optional(),
		text: Joi.string().optional(),
	},
};

const validator = createValidator({ passError: true });
export const DiceFaceUpdateBodyValidations = validator.body(Joi.object(schema));
