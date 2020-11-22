import { Response, Router } from 'express';
import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import SocketServeur from '../Serveur/Sockets/SockerServeur';
import logguer from 'basic-log';

export default class SocketController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;

	constructor() {
		super();
		this.baseRoute = {
			path: '/socket',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/test', this.testSocket.bind(this));
		return this.router;
	}

	private testSocket(_, res: Response) {
		logguer.d('Sending test socket');
		SocketServeur.shared.io.emit('test', { message: 'Testing successfull' });
		res.send({ success: true });
	}
}
