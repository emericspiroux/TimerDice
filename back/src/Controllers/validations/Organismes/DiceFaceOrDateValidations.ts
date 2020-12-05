import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { schema as DateSchema } from '../Atoms/DateValidations';
import { schema as DiceSchema } from '../Atoms/DiceFaceValidations';

export const newShema = {
	...DateSchema,
	...DiceSchema,
};

const validator = createValidator({ passError: true });
export const DiceFaceOrDateValidations = validator.query(Joi.object(newShema));
