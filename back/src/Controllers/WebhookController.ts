import { NextFunction, request, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import { WebhookValidations } from './validations/Atoms/Body/WebhookValidations';
import ModelError from '../Models/Errors/ModelError';
import { idParamsValidation } from './validations/Atoms/Params/IdParamsValidations';
import WebhookModel from '../Models/Webhook.model';
import { DiceFaceValidations } from './validations/Atoms/QueryParameters/DiceFaceValidations';
import DiceFaceTime, { IDiceFaceTime } from '../Models/DiceFaceTime';
import DiceFace, { IDiceFace } from '../Models/DiceFace';
import WebhookEngine from '../libs/WebhookEngine/WebhookEngine';
import { AxiosError } from 'axios';

export default class WebhookController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/webhooks',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/', this.getWebhooks.bind(this));
		this.router.post('/', WebhookValidations, FormErrorMiddleware, this.postNew.bind(this));
		this.router.post(
			'/test/:id',
			idParamsValidation,
			DiceFaceValidations,
			FormErrorMiddleware,
			this.testWebhook.bind(this)
		);
		this.router.delete('/:id', idParamsValidation, FormErrorMiddleware, this.delete.bind(this));
		return this.router;
	}

	private async getWebhooks(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await WebhookModel.getAll());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get all', err.stack));
		}
	}

	private async testWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const webhookEngine = new WebhookEngine();
			const webhook = await WebhookModel.getOne(req.params.id);
			const faceId = req.body?.face;
			let face: IDiceFace;
			let diceTime: IDiceFaceTime;
			try {
				face = await DiceFace.getFace(faceId);
				diceTime = new DiceFaceTime({
					face,
					faceId,
					start: new Date(),
					current: true,
					end: new Date(),
				});
			} catch {
				//
			}
			try {
				await webhookEngine.send(webhook, diceTime);
			} catch (err) {
				return next(
					new ControllerError(501, 'Webhook call fail', (err as AxiosError).message, (err as AxiosError).response.data)
				);
			}
			res.send({ webhook, diceTime });
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to test webhook', err.stack));
		}
	}

	private async postNew(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deleteResult = await WebhookModel.adding(req.body.uri);
			res.send(deleteResult);
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to post new', err.stack));
		}
	}

	private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const deleteResult = await WebhookModel.deleting(req.params['id']);
			res.send(deleteResult);
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to delete current', err.stack));
		}
	}
}
