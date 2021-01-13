import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const schema = {
	uri: Joi.string()
		.uri({
			domain: {
				minDomainSegments: 2,
			},
			allowRelative: false,
		})
		.required(),
};

const validator = createValidator({ passError: true });
export const WebhookValidations = validator.body(Joi.object(schema));
