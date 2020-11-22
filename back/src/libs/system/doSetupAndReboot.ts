import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';
import { getRootPath } from './index';

export function doSetupAndReboot(): Promise<void> {
	return new Promise((s, f) => {
		let child = exec('npm run setup', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> doSetup :', err, stdout);
			if (err) return f(err);
			s();
		});
		child.stdout.on('data', function (data) {
			console.log(data.toString());
		});
	});
}
