import { NextFunction, request, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import { DiceFaceOrDateValidations } from './validations/Organismes/DiceFaceOrDateValidations';
import { DiceFaceTimeUpdateBodyValidations } from './validations/Atoms/Body/DiceFaceTimeUpdateValidations';
import DiceFaceTime, { IDiceFaceTime, IDiceFaceTimeUpdateBody } from '../Models/DiceFaceTime';
import ModelError from '../Models/Errors/ModelError';
import DiceFace from '../Models/DiceFace';
import DiceObject from '../libs/DiceEngine/DiceObject/DiceObject';
import { idParamsValidation } from './validations/Atoms/Params/IdParamsValidations';
import SocketSystem from '../libs/SocketActions/SocketSystem';
import ElectronEngine from '../libs/ElectronEngine/ElectronEngine';
import WebhookEngine from '../libs/WebhookEngine/WebhookEngine';

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
		this.router.get('/calendar', DiceFaceOrDateValidations, FormErrorMiddleware, this.getCalendar.bind(this));
		this.router.get('/current', this.getCurrent.bind(this));
		this.router.delete('/current', this.stopCurrent.bind(this));
		this.router.patch(
			'/:id',
			idParamsValidation,
			DiceFaceTimeUpdateBodyValidations,
			FormErrorMiddleware,
			this.update.bind(this)
		);
		this.router.delete('/:id', idParamsValidation, FormErrorMiddleware, this.delete.bind(this));
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

	private async getCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const start = (req.query['start'] && new Date(req.query['start'] as string)) || null;
			const end = (req.query['end'] && new Date(req.query['end'] as string)) || null;
			const face = (req.query['face'] && Number(req.query['face'] as string)) || null;
			res.send(await DiceFaceTime.getCalendar(start, end, face));
		} catch (err) {
			next(new ControllerError(500, 'unable to get calendar', err.stack));
		}
	}

	private async getCurrent(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			console.log('Get current');
			const current = await DiceFaceTime.getCurrent();
			res.send(current);
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}

	private async startNew(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			console.log('Get current');
			const current = await DiceFaceTime.getCurrent();
			if (current) {
			}
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}

	private async stopCurrent(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			ElectronEngine.shared.onChange();
			SocketSystem.fireStopCurrentDice();
			WebhookEngine.shared.clean();
			res.send(await DiceFaceTime.stop());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}

	private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const diceFaceTime: IDiceFaceTime = await DiceFaceTime.updating(
				req.params['id'],
				req.body as IDiceFaceTimeUpdateBody
			);
			res.send(diceFaceTime);
			if (diceFaceTime.current) {
				WebhookEngine.shared.execute(diceFaceTime);
				ElectronEngine.shared.onChange(diceFaceTime);
			}
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to update', err.stack));
		}
	}

	private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deleteResult = await DiceFaceTime.deleting(req.params['id']);
			logguer.d(`Deleted DiceFaceTime result:`, deleteResult);
			res.send(deleteResult);
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}
}
