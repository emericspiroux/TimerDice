import Agenda from 'agenda';

declare global {
	namespace Express {
		interface Request {
			agenda: Agenda;
		}
	}
}
