import { NextFunction, Request, Response, Router } from 'express';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import ModelError from '../Models/Errors/ModelError';
import DiceFace, { IDiceFaceUpdateBody } from '../Models/DiceFace';
import { idParamsValidation } from './validations/Atoms/Params/IdParamsValidations';
import { DiceFaceUpdateBodyValidations } from './validations/Atoms/Body/DiceFaceUpdateValidations';
import { DiceFaceValidations } from './validations/Atoms/QueryParameters/DiceFaceValidations';
import SocketSystem from '../libs/SocketActions/SocketSystem';

export default class FaceController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/face',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/', this.getAll.bind(this));
		this.router.get('/current', this.getCurrent.bind(this));
		this.router.post(
			'/settings/start',
			DiceFaceValidations,
			FormErrorMiddleware,
			this.startCurrentFaceSetting.bind(this)
		);
		this.router.post('/settings/stop', this.stopCurrentFaceSetting.bind(this));
		this.router.patch(
			'/:id',
			idParamsValidation,
			DiceFaceUpdateBodyValidations,
			FormErrorMiddleware,
			this.update.bind(this)
		);
		return this.router;
	}

	private async getAll(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFace.getAll());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get all', err.stack));
		}
	}

	private async startCurrentFaceSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await DiceFace.stopCurrentSettings();
			SocketSystem.fireSettingDice();
			const diceFace = await DiceFace.setCurrentSettings(Number(req.query['face']));
			SocketSystem.fireSettingDice(diceFace);
			res.send(diceFace);
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get all', err.stack));
		}
	}

	private async stopCurrentFaceSetting(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFace.stopCurrentSettings());
			SocketSystem.fireSettingDice();
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get all', err.stack));
		}
	}

	private async getCurrent(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFace.getCurrentSettings());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current setting', err.stack));
		}
	}

	private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFace.updating(req.params['id'], req.body as IDiceFaceUpdateBody));
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to update', err.stack));
		}
	}
}
