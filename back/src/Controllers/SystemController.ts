import { NextFunction, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import { doPull, getGitLastTag } from '../libs/git';
import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import { doSetupAndReboot, getLogs } from '../libs/system';
import { PaginationValidations } from './validations/PaginationValidations';
import FormErrorMiddleware from './validations/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import PackageJSON from '../../package.json';
import { getRootPath } from '../libs/system/getRootPath';
import { LightValidations } from './validations/LightValidations';

export default class SystemController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/system',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/logs', PaginationValidations, FormErrorMiddleware, this.getLogs.bind(this));
		this.router.get('/update', this.getHasUpdate.bind(this));
		this.router.get('/pwd', this.getDirName.bind(this));
		this.router.post('/update', this.doUpdate.bind(this));
		return this.router;
	}

	private async doUpdate(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (process.env.NODE_ENV !== 'development') {
				let result = await doPull(await getGitLastTag());
				await doSetupAndReboot();
				logguer.i('Updated :', result);
			}
			res.send({ success: true });
		} catch (err) {
			next(new ControllerError(500, 'unable to update system', err.stack));
		}
	}

	private async getHasUpdate(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			let currentVersion = PackageJSON.version;
			let lastTag = await getGitLastTag();
			logguer.d('SystemController -> currentVersion', currentVersion);
			logguer.d('SystemController -> lastTag', lastTag);
			res.send({
				hasUpdate: currentVersion !== lastTag,
			});
		} catch (err) {
			next(new ControllerError(500, 'unable to check update', err.stack));
		}
	}

	private async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			let logs = (await getLogs()).reverse();
			res.send(logs.slice(Number(req.query['_start'] || 0), Number(req.query['_end'] || logs.length)).reverse());
		} catch (err) {
			next(new ControllerError(500, 'unable to get logs', err.stack));
		}
	}

	private async getDirName(_: Request, res: Response): Promise<void> {
		res.send({ pwd: getRootPath() });
	}
}
