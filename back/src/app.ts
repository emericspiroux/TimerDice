import Serveur from './Serveur/serveur';
import dotenv from 'dotenv';

import SocketController from './Controllers/SocketController';

import PackageJson from '../package.json';

import logger from 'basic-log';

import DiceEngine from './libs/DiceEngine/Engine/DiceEngine';
import TimerController from './Controllers/TimerController';
import FaceController from './Controllers/FaceController';
import ElectronEngine from './libs/ElectronEngine/ElectronEngine';

// Getting env var
dotenv.config({
	path: (() => {
		logger.i('Current version:', PackageJson.version);
		logger.i('process.env.NODE_ENV :', process.env.NODE_ENV || 'production');
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

(async () => {
	// Creating server
	let serveur = new Serveur({
		mongo: {
			uri: process.env.MONGO_URI || 'mongodb://localhost/DiceTimer',
		},
	});

	// Add controllers
	const faceController = new FaceController();
	const timerController = new TimerController();

	serveur.router.addController(faceController);
	serveur.router.addController(timerController);
	serveur.router.addController(new SocketController());

	// Start listenning
	serveur.start(Number(process.env.PORT || 9999));

	// Init dices faces
	await faceController.initFaceDefault();

	// Launching dice detection
	DiceEngine.shared.start(timerController.onChangeDiceFace);

	// Launch electron
	if (process.env.NODE_ENV !== 'development') {
		ElectronEngine.shared.init();
	}
})();
