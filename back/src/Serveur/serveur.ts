import cors from 'cors';
import bodyParser from 'body-parser';
import util from 'util';
import express, { Express, NextFunction, Request, Response } from 'express';
import Mongoose from 'mongoose';
import logguer from 'basic-log';

import Router from './Router';
import IServeurConfig from './Types/IServeurConfig.type';
import wait from '../libs/wait';
import IServeurMongoConfig from './Types/IServeurMongoConfig.type';
import './Types/GlobalExpressRequest';
import ControllerError from '../Controllers/Errors/ControllerError';
import SocketServeur from './Sockets/SockerServeur';

import ModelError from '../Models/Errors/ModelError';
import fs from 'fs';

export default class Serveur {
	public app: Express = express();
	public port: number;
	public router: Router;
	private configPrv: IServeurConfig;
	private socketServeur: SocketServeur = SocketServeur.shared;

	constructor(config: IServeurConfig) {
		this.configPrv = config;
		this.router = new Router();
		this.initMiddleware();
		logguer.setLevel(process.env.DEBUG_LEVEL);
	}

	get config(): IServeurConfig {
		return this.configPrv;
	}

	private initMiddleware() {
		this.app.use(cors());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	private initRoutes() {
		this.router.all.forEach((route) => {
			this.app.use(route.path, route.router);
		});
		this.initReactServerRoutes();
	}

	private initReactServerRoutes() {
		this.app.use('/', express.static(process.env.PUBLIC_FILES_PATH));
		this.app.use('/assets/', express.static(process.env.PUBLIC_ASSETS_PATH));
		this.app.get('*', function (_, res) {
			res.sendFile('index.html', { root: process.env.PUBLIC_FILES_PATH });
		});
	}

	private initEndPointLog() {
		this.app.use((req: Request, _, next: NextFunction) => {
			logguer.i(`${req.method} ${req.originalUrl}`);
			if (req.method !== 'GET' && req.body) {
				logguer.d(`Body : ${util.inspect(req.body, false, null, true)}`);
			}
			req.next();
		});
	}

	private initErrorRoute() {
		this.app.use((err: any, _1: Request, res: Response, _2: NextFunction) => {
			logguer.e('Serveur -> initErrorRoute -> err', err);
			if (err instanceof ControllerError) return res.status(err.status).send(err);
			if (err instanceof ModelError) return res.status(err.status).send(err);
			if ('type' in err) return res.status(400).send(err);
			if (process.env.DEBUG === 'debug' || process.env.DEBUG === 'all') return res.status(500).send(err);
			res.status(500).send({ statusCode: 500, message: 'Internal error' });
		});
	}

	private async connectDB(config: IServeurMongoConfig) {
		try {
			logguer.d(`Connecting MongoDB: ${config.uri}`);
			await Mongoose.connect(config.uri);
			Mongoose.connection.on('error', function (err) {
				logguer.e('Mongo error :', err);
			});
			logguer.i(`Connected to MongoDB: ${config.uri}`);
		} catch (err) {
			logguer.e('Mongoose failed to connect :', err);
			logguer.e('Trying to reconnect to mongoose in 5 sec');
			await wait(3000);
			await this.connectDB(config);
		}
	}

	private async initCheckUpdate() {}

	async start(port: number) {
		this.port = port;
		if (this.configPrv.mongo) {
			await this.connectDB(this.configPrv.mongo);
		}
		this.initEndPointLog();
		this.initRoutes();
		this.initErrorRoute();
		let http = this.app.listen(this.port, () => {
			logguer.i(`Server started at http://localhost:${this.port}`);
		});
		this.socketServeur.start(http);
	}
}
