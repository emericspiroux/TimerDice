import { createValidator } from 'express-joi-validation';
import Joi from 'joi';
import { schema as TimeRange } from '../../Atoms/Body/TimeRangeValidations';
import { schema as DiceFace } from '../../Atoms/Body/DiceFaceValidations';

export const newShema = {
	...TimeRange,
	...DiceFace,
};

const validator = createValidator({ passError: true });
export const NewRangeTimeValidations = validator.body(Joi.object(newShema));
