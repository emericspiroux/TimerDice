import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function doPull(tag: string): Promise<string> {
	return new Promise((s, f) =>
		exec(`git pull origin ${tag}`, (err: ExecException, stdout: string) => {
			logguer.d('Debug -> doPull :', err, stdout);
			if (err) return f(err);
			s(stdout);
		})
	);
}
