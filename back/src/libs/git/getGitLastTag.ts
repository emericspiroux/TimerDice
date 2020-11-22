import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function getGitLastTag(): Promise<string> {
	return new Promise((s, f) =>
		exec('git fetch && git tag -l | cat', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> getGitLastTag :', err, stdout);
			if (err) return f(err);
			let versions = stdout
				.split('\n')
				.filter((e: string) => e)
				.map((a) =>
					a
						.split('.')
						.map((n) => +n + 100000)
						.join('.')
				)
				.sort()
				.map((a) =>
					a
						.split('.')
						.map((n) => +n - 100000)
						.join('.')
				);
			let lastVersion = versions.pop();
			logguer.d('getGitLastTag -> last version :', lastVersion);
			s(lastVersion);
		})
	);
}
