import { exec, ExecException } from 'child_process';
import logguer from 'basic-log';

export function doReboot(): Promise<void> {
	return new Promise((s, f) =>
		exec('reboot', (err: ExecException, stdout: string) => {
			logguer.d('Debug -> doReboot :', err, stdout);
			if (err) return f(err);
			s();
		})
	);
}
