import Serveur from './Serveur/serveur';
import dotenv from 'dotenv';

import SocketController from './Controllers/SocketController';
import SystemController from './Controllers/SystemController';

import PackageJson from '../package.json';

import logger from 'basic-log';
import DiceEngine from './libs/DiceEngine/Engine/DiceEngine';
import DiceObject from './libs/DiceEngine/DiceObject/DiceObject';
import DiceFace from './Models/DiceFace';
import DiceFaceTime from './Models/DiceFaceTime';

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

// Launching dice detection

async function InitFaceDefault() {
	const faceIds = [1, 2, 3, 4, 5, 6, 7, 8];
	for (const faceId of faceIds) {
		DiceFace.define(true, faceId, `Face ${faceId}`, 'blue');
	}
}

(async () => {
	await InitFaceDefault();
	let previous = -1;
	DiceEngine.shared.start(async (dice: DiceObject) => {
		console.log('🚀 ~ file: app.ts ~ line 58 ~ DiceEngine.shared.start ~ dice', dice);
		if (dice.face !== previous) {
			logger.i('Detect dice motion face :', dice.face);
			previous = dice.face;
			try {
				const diceFaceTimeStop = await DiceFaceTime.stop();
				logger.d('Stoping diceFaceTime :', diceFaceTimeStop);
			} catch (err) {
				logger.d('Error on stopping diceFaceTime :', err);
			}
			if (dice.face !== -1) {
				const diceFace = await DiceFace.getFace(dice.face);
				const diceFaceTimeStart = await DiceFaceTime.start(diceFace);
				logger.d('Starting diceFaceTime :', diceFaceTimeStart);
			}
		}
		if (dice.isOff) {
			DiceFaceTime.stop();
		}
	});
})();
