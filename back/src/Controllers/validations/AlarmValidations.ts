import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

function uniqueElement(a, b) {
	if (a === b) return a;
}

const newAlarmShema = {
	enabled: Joi.boolean().default(true),
	days: Joi.array()
		.items(Joi.number().valid(0, 1, 2, 3, 4, 5, 6))
		.unique(uniqueElement)
		.min(1)
		.max(7)
		.sort()
		.required(),
	hour: Joi.number().min(0).max(23).required(),
	min: Joi.number().min(0).max(59).required(),
	play: Joi.object({
		playlistId: Joi.string().required(),
		shuffle: Joi.boolean().default(false),
		volume: Joi.number().min(0).max(1).required(),
	}),
	__v: Joi.any().strip(true),
	_id: Joi.any().strip(true),
	id: Joi.any().strip(true),
};

let validator = createValidator({ passError: true });
export const AlarmValidation = validator.body(Joi.object(newAlarmShema));
