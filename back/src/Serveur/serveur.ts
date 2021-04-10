import cors from 'cors';
import bodyParser from 'body-parser';
import util from 'util';
import express, { Express, NextFunction, Request, Response } from 'express';
import Mongoose from 'mongoose';
import logguer from 'basic-log';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';

import Router from './Router';
import IServeurConfig from './Types/IServeurConfig.type';
import wait from '../libs/wait';
import IServeurMongoConfig from './Types/IServeurMongoConfig.type';
import './Types/GlobalExpressRequest';
import ControllerError from '../Controllers/Errors/ControllerError';
import SocketServeur from './Sockets/SockerServeur';

import ModelError from '../Models/Errors/ModelError';
import ElectronEngine from '../libs/ElectronEngine/ElectronEngine';
import TimerDiceError from '../Errors/TimerDiceError';
import FormValidationError from '../Controllers/Errors/FormValidationError';

export default class Serveur {
	public app: Express = express();
	public port: number;
	public router: Router;
	private configPrv: IServeurConfig;
	private socketServeur: SocketServeur = SocketServeur.shared;
	private mongoChildProcess: ChildProcessWithoutNullStreams;

	constructor(config: IServeurConfig) {
		this.configPrv = config;
		this.router = new Router();
		this.initMiddleware();
		logguer.setLevel(process.env.DEBUG_LEVEL || 'info');
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
		this.app.use('/', express.static(process.env.PUBLIC_FILES_PATH || `${__dirname}/../../public`));
		this.app.use('/assets/', express.static(process.env.PUBLIC_ASSETS_PATH || `${__dirname}/../../assets`));
		this.app.get('*', function (_, res) {
			res.sendFile('index.html', { root: process.env.PUBLIC_FILES_PATH || `${__dirname}/../../public` });
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
			if (err instanceof FormValidationError) return res.status(400).send(err);
			if (err instanceof TimerDiceError) return res.status(err.status).send(err);
			if (logguer.level === 'debug' || logguer.level === 'all') return res.status(500).send(err);
			res.status(500).send({ statusCode: 500, message: 'Internal error' });
		});
	}

	private startMongoDB(): Promise<void> {
		return new Promise((s, f) => {
			this.mongoChildProcess = spawn(
				path.resolve(
					__dirname,
					process.env.NODE_ENV === 'development' ? '../../mongodb/mongod' : '../../../mongodb/mongod'
				),
				[`--dbpath=${ElectronEngine.dbPath}`, '--port', '27020']
			);
			this.mongoChildProcess.stdout.on('data', (data) => {
				logguer.d(data.toString('utf8'));
				const dataArray = data.toString('utf8').split('\n');
				for (const dataLine of dataArray) {
					try {
						const dataJSON = JSON.parse(dataLine);
						if (dataJSON.ctx === 'listener' && dataJSON.msg === 'Waiting for connections') {
							s();
						}
					} catch {
						/* */
					}
				}
			});
			this.mongoChildProcess.stderr.on('data', (data) => {
				logguer.e(data.toString('utf8'));
				f();
			});
			this.mongoChildProcess.on('close', (code) => {
				logguer.e('Process exited with code: ' + code);
			});
			process.on('uncaughtException', function (err) {
				logguer.e('Caught exception: ' + err);
				if (this.mongoChildProcess) {
					this.mongoChildProcess.kill();
					logguer.i('Kill mongodb process');
				}
				process.exit(0);
			});

			process.on('exit', function (code) {
				if (this.mongoChildProcess) {
					logguer.i('Kill mongodb process');
					this.mongoChildProcess.kill();
				}
				logguer.i('Kill signal received:', code);
			});
		});
	}

	stopMongo() {
		if (this.mongoChildProcess) {
			this.mongoChildProcess.kill();
			logguer.i('Kill mongodb process');
		}
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

	async start(port: number): Promise<void> {
		return new Promise(async (s) => {
			this.port = port;
			if (this.configPrv.mongo) {
				if (process.env.NODE_ENV !== 'development') {
					await this.startMongoDB();
				}
				await this.connectDB(this.configPrv.mongo);
			}
			this.initEndPointLog();
			this.initRoutes();
			this.initErrorRoute();
			let http = this.app.listen(this.port, () => {
				logguer.i(`Server started at http://localhost:${this.port}`);
				s();
			});
			this.socketServeur.start(http);
		});
	}
}
