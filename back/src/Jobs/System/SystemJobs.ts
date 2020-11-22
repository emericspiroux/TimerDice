import Agenda from 'agenda';
import IJobsDefine from '../Types/IJobsDefine';
import SystemEventNamesEnum from './SystemEventNames.enum';
import _ from 'lodash';
import logguer from 'basic-log';
import SocketSystem from '../../libs/SocketActions/SocketSystem';

export default class SystemJobs implements IJobsDefine {
	definitions(): { [key: string]: (job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) => void } {
		let arrayOfDefinitions: {
			[key: string]: (job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) => void;
		} = {};
		arrayOfDefinitions[SystemEventNamesEnum.checkUpdate] = this.checkUpdateDefine;
		return arrayOfDefinitions;
	}

	private checkUpdateDefine(job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) {
		logguer.d('Check update job');
		SocketSystem.fireCheckUpdate();
		done();
	}
}
