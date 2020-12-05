import { NextFunction, request, Request, Response, Router } from 'express';
import logguer from 'basic-log';

import AppController, { IAppController } from './Types/AppController.abstract';
import AppRouteDescriptor from './Types/AppRouteDescriptor.type';
import FormErrorMiddleware from './validations/Errors/FormErrorMiddleware';
import ControllerError from './Errors/ControllerError';
import { DiceFaceOrDateValidations } from './validations/Organismes/DiceFaceOrDateValidations';
import DiceFaceTime from '../Models/DiceFaceTime';
import ModelError from '../Models/Errors/ModelError';
import DiceFace from '../Models/DiceFace';
import DiceObject from '../libs/DiceEngine/DiceObject/DiceObject';
import SocketServeur from '../Serveur/Sockets/SockerServeur';

export default class DiceController extends AppController implements IAppController {
	baseRoute: AppRouteDescriptor;
	private previous = -1;

	constructor() {
		super();
		this.baseRoute = {
			path: '/timer',
			router: this.getRoute(),
		};
	}

	getRoute(): Router {
		this.router.get('/', DiceFaceOrDateValidations, FormErrorMiddleware, this.getRange.bind(this));
		this.router.get('/current', this.getCurrent.bind(this));
		return this.router;
	}

	async onChangeDiceFace(dice: DiceObject) {
		logguer.i('Detect dice motion face :', dice.face);
		if (dice.face !== this.previous) {
			logguer.i('Not same as this.previous :', this.previous);
			this.previous = dice.face;
			try {
				const diceFaceTimeStop = await DiceFaceTime.stop();
				logguer.d('Stoping diceFaceTime :', diceFaceTimeStop);
				logguer.d('Stoping diceFaceTime duration :', diceFaceTimeStop.duration);
				if (
					process.env.TIMETOUT_DURATION_BEFORE_SAVE &&
					diceFaceTimeStop.duration < Number(process.env.TIMETOUT_DURATION_BEFORE_SAVE)
				) {
					logguer.d('Deleting diceFaceTime because too short :', diceFaceTimeStop.id);
					await DiceFaceTime.deleting(diceFaceTimeStop.id);
				}
			} catch (err) {
				logguer.d('Error on stopping diceFaceTime :', err);
			}
			if (dice.face !== -1) {
				const diceFace = await DiceFace.getFace(dice.face);
				const diceFaceTimeStart = await DiceFaceTime.start(diceFace);
				SocketServeur.shared.io.emit('dice.start', diceFaceTimeStart);
				logguer.d('Starting diceFaceTime :', diceFaceTimeStart);
			} else {
				SocketServeur.shared.io.emit('stop');
			}
		}
		if (dice.isOff && this.previous !== -1) {
			this.previous = -1;
			await DiceFaceTime.stop();
			SocketServeur.shared.io.emit('dice.stop');
		}
	}

	async InitFaceDefault() {
		logguer.d('DiceFaces init...');
		if (await DiceFace.getFace(1)) return logguer.d('DiceFaces already inited. Skipped.');
		const faceIds = [1, 2, 3, 4, 5, 6, 7, 8];
		const faceTitle = [
			'Code',
			'Code Review',
			'Réunion',
			'Read Documentation',
			'Help others',
			'Pause',
			'debug',
			'Write documentation',
		];
		for (const [index, faceId] of faceIds.entries()) {
			const dice = await DiceFace.define(true, faceId, faceTitle[index] || `Face ${faceId}`, 'blue');
			logguer.d('DiceFaces define :', dice);
		}
	}

	private async getRange(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const start = (req.query['start'] && new Date(req.query['start'] as string)) || null;
			const end = (req.query['end'] && new Date(req.query['end'] as string)) || null;
			const face = (req.query['face'] && Number(req.query['face'] as string)) || null;
			res.send(await DiceFaceTime.getByRange(start, end, face));
		} catch (err) {
			next(new ControllerError(500, 'unable to get range', err.stack));
		}
	}

	private async getCurrent(_: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.send(await DiceFaceTime.getCurrent());
		} catch (err) {
			if (err instanceof ModelError) {
				return next(err);
			}
			next(new ControllerError(500, 'unable to get current', err.stack));
		}
	}
}
