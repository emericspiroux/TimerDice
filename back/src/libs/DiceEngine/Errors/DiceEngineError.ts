import TimerDiceError from '../../../Errors/TimerDiceError';

export class FaceNotFoundDiceEngineError extends TimerDiceError {
	constructor() {
		super(404, 'face_not_found', 'Dice face is not found');
	}
}
