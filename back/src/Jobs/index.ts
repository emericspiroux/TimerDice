import Agenda from 'agenda';
import IServeurMongoConfig from '../Serveur/Types/IServeurMongoConfig.type';
import logguer from 'basic-log';
import wait from '../libs/wait';
import AlarmJobs from './Alarms/AlarmJobs';
import SystemJobs from './System/SystemJobs';
import SystemEventNamesEnum from './System/SystemEventNames.enum';

class Jobs {
	private agendaPrv: Agenda;

	get agenda(): Agenda {
		return this.agendaPrv;
	}

	private defineJobs(agenda: Agenda) {
		let alarm = new AlarmJobs();
		let system = new SystemJobs();
		for (const [key, define] of Object.entries(alarm.definitions())) agenda.define(key, define);
		for (const [key, define] of Object.entries(system.definitions())) agenda.define(key, define);
	}

	async start(config: IServeurMongoConfig): Promise<Agenda> {
		try {
			logguer.d(`Connecting Agenda: ${config.uri}`);
			const agenda = new Agenda({
				db: {
					address: config.uri,
					collection: 'jobs',
					options: config.options,
				},
			});
			agenda.on('ready', () => {
				agenda.start();
				this.repeatCheckUpdate();
			});
			agenda.on('fail', (err) => {
				logguer.e(`Agenda Job failed with error: ${err.message}`);
			});
			logguer.i(`Connected to agenda: ${config.uri}`);
			this.defineJobs(agenda);
			this.agendaPrv = agenda;
			return agenda;
		} catch (err) {
			logguer.e('Job start failed :', err);
			logguer.e('Trying to reconnect to mongoose in 5 sec');
			await wait(3000);
			await this.start(config);
		}
		return;
	}

	async findJob(query: any): Promise<Agenda.Job<Agenda.JobAttributesData>[] | undefined> {
		return new Promise((s, f) => {
			this.agendaPrv.jobs(query, (err, jobs) => {
				if (err) return f(err);
				s(Array.isArray(jobs) && jobs.length ? jobs : undefined);
			});
		});
	}

	private async repeatCheckUpdate() {
		let job = await this.findJob({ name: SystemEventNamesEnum.checkUpdate });
		if (job) return;
		let newJob = this.agendaPrv.create(SystemEventNamesEnum.checkUpdate);
		newJob.repeatEvery('0 17 * * *', { skipImmediate: true });
		newJob.save();
	}
}

export default new Jobs();
