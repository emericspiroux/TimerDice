import Serveur from './Serveur/serveur';
import dotenv from 'dotenv';

import AlarmController from './Controllers/AlarmController';
import SocketController from './Controllers/SocketController';
import SpotifyController from './Controllers/SpotifyController';
import SystemController from './Controllers/SystemController';

import PackageJson from '../package.json';

import logger from 'basic-log';

// Getting env var
dotenv.config({
	path: (() => {
		logger.i('Current version:', PackageJson.version);
		logger.i('process.env.NODE_ENV :', process.env.NODE_ENV || 'Production');
		switch (process.env.NODE_ENV) {
			case 'development':
				return '.env.development';
			case 'staging':
				return '.env.staging';
			default:
				return '.env';
		}
	})(),
});

// Creating server
let serveur = new Serveur({
	mongo: {
		uri: process.env.MONGO_URI,
	},
});

// Add controllers
serveur.router.addController(new SocketController());
serveur.router.addController(new SystemController());

// Start listenning
serveur.start(Number(process.env.PORT));
