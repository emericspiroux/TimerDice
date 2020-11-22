import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function getLogs(): Promise<string[]> {
	return new Promise((s, f) =>
		exec('journalctl -u raspalarm.service -b | cat', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> getLogs :', err);
			if (process.env.NODE_ENV === 'development') {
				let list = [];
				for (let i = 0; i <= 100; i++) list.push(`[info] fake log #${i}`);
				return s(list);
			}
			if (err) return f(err);
			s(stdout.split('\n'));
		})
	);
}
