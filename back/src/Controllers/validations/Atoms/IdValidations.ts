import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import JoiForObjectId from 'joi-objectid';

const JoiObjectId = JoiForObjectId(Joi);
const validator = createValidator({ passError: true });

export const schema = {
	id: JoiObjectId().required(),
};

export const idParamsValidation = validator.params(Joi.object(schema));
