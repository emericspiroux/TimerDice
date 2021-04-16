import Serveur from './Serveur/serveur';
import dotenv from 'dotenv';

import SocketController from './Controllers/SocketController';

import PackageJson from '../package.json';

import logger from 'basic-log';

import DiceEngine from './libs/DiceEngine/Engine/DiceEngine';
import TimerController from './Controllers/TimerController';
import FaceController from './Controllers/FaceController';
import WebhookController from './Controllers/WebhookController';
import ElectronEngine from './libs/ElectronEngine/ElectronEngine';
import DiceFaceTime from './Models/DiceFaceTime';
import SocketSystem from './libs/SocketActions/SocketSystem';
import WebhookEngine from './libs/WebhookEngine/WebhookEngine';

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
			uri: process.env.MONGO_URI || 'mongodb://localhost:27020/DiceTimer',
		},
	});

	// Add controllers
	serveur.router.addController(new FaceController());
	serveur.router.addController(new TimerController());
	serveur.router.addController(new SocketController());
	serveur.router.addController(new WebhookController());

	// Start listenning
	await serveur.start(Number(process.env.PORT || 9999));

	// Launching dice detection
	DiceEngine.shared.start();

	// Launch electron
	if (process.env.NODE_ENV !== 'development') {
		ElectronEngine.shared.onClose(() => {
			serveur.stopMongo();
		});
		ElectronEngine.shared.setOnStopDice(async () => {
			await DiceFaceTime.stop();
			ElectronEngine.shared.onChange();
			SocketSystem.fireStopCurrentDice();
			WebhookEngine.shared.clean();
		});
		await ElectronEngine.shared.init();
	}
})();
