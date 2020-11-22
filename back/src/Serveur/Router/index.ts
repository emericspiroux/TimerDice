import { Express } from 'express';
import { IAppController } from '../../Controllers/Types/AppController.abstract';
import AppRouteDescriptor from '../../Controllers/Types/AppRouteDescriptor.type';

export default class Router {
	routes: AppRouteDescriptor[] = [];
	app: Express;

	addController(appController: IAppController) {
		this.routes.push(appController.baseRoute);
	}

	get all(): AppRouteDescriptor[] {
		return this.routes;
	}
}
