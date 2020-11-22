import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function canPull(): Promise<boolean> {
	return new Promise((s, f) =>
		exec('git remote -v update', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> needPull :', err, stdout);
			if (err) return f(err);
			let isUpToDate =
				stdout
					.split('\n')
					.filter((e: string) => e.match(new RegExp('(^( = [up to date]s*master)|^( = [à jour]s*master))', 'm')))
					.length > 0;
			s(!isUpToDate);
		})
	);
}
