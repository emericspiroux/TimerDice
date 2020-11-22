import Agenda from 'agenda';

export default interface IJobsDefine {
	definitions(): { [key: string]: (job: Agenda.Job<Agenda.JobAttributesData>, done: (err?: Error) => void) => void };
}
