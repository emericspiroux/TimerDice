import { NextFunction, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import ModelError from '../Models/Errors/ModelError';
import DiceFace, { IDiceFaceUpdateBody } from '../Models/DiceFace';
import { idParamsValidation } from './validations/Atoms/Params/IdParamsValidations';
import { DiceFaceUpdateBodyValidations } from './validations/Atoms/Body/DiceFaceUpdateValidations';
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
		this.router.patch(
			'/:id',
			idParamsValidation,
			DiceFaceUpdateBodyValidations,
			FormErrorMiddleware,
			this.update.bind(this)
		);
		return this.router;
	}

	async initFaceDefault(override = false) {
		logguer.d('DiceFaces init...');
		if (override || !(await DiceFace.getFace(1))) {
			const faceIds = [1, 2, 3, 4, 5, 6, 7, 8];
			const faceTitle = [
				'Code',
				'Code Review',
				'Réunion',
				'Read Documentation',
				'Help others',
				'Pause',
				'debug',
				'Write documentation',
			];
			const faceSlackStatus = [
				'En train de coder',
				'En pleine code review',
				'En Réunion, Ne pas déranger !',
				'Lit de le documentation',
				"Est en train d'aider des gens",
				'Est en pause',
				'Planche sur un bug',
				'Utilise sa plus belle plume',
			];
			const faceSlackEmoji = [
				':computer:',
				':open_book:',
				':date:',
				':newspaper:',
				':fire_engine:',
				':coffee:',
				':bug:',
				':memo:',
			];
			const faceColor = [
				'rgb(33, 150, 243)',
				'rgb(42, 188, 208)',
				'rgb(167, 215, 46)',
				'rgb(254, 215, 58)',
				'rgb(249, 185, 61)',
				'rgb(227, 44, 105)',
				'rgb(104, 62, 175)',
				'rgb(56, 64, 70)',
			];
			for (const [index, faceId] of faceIds.entries()) {
				const dice = await DiceFace.define(
					true,
					faceId,
					faceTitle[index] || `Face ${faceId}`,
					faceColor[index] || 'blue',
					{
						text: faceSlackStatus[index],
						emoji: faceSlackEmoji[index],
					}
				);
				logguer.d('DiceFaces define :', dice);
			}
		} else {
			logguer.d('DiceFaces already inited. Skipped.');
		}
		const settingDice = await DiceFace.getCurrentSettings();
		if (settingDice) {
			SocketSystem.fireSettingDice(settingDice);
		}
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
