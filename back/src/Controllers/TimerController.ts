import { NextFunction, request, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import PackageJSON from '../../package.json';
import { getRootPath } from '../libs/system/getRootPath';
import { DateRangeValidations } from './validations/Atoms/DateValidations';
import { DiceFaceOrDateValidations } from './validations/Organismes/DiceFaceOrDateValidations';
import DiceFaceTime from '../Models/DiceFaceTime';
import ModelError from '../Models/Errors/ModelError';

export default class DiceController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/timer',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/', DiceFaceOrDateValidations, FormErrorMiddleware, this.getRange.bind(this));
		this.router.get('/current', this.getCurrent.bind(this));
		return this.router;
	}

	private async getRange(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const start = (req.query['start'] && new Date(req.query['start'] as string)) || null;
			const end = (req.query['end'] && new Date(req.query['end'] as string)) || null;
			const face = (req.query['face'] && Number(req.query['face'] as string)) || null;
			res.send(await DiceFaceTime.getByRange(start, end, face));
		} catch (err) {
			next(new ControllerError(500, 'unable to get range', err.stack));
		}
	}

	private async getCurrent(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFaceTime.getCurrent());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}
}
