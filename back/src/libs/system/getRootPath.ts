import logguer from 'basic-log';
import path from 'path';

export function getRootPath(): string {
	const appDir = path.dirname(require.main.filename);
	logguer.d('getRootPath:', appDir);
	return appDir;
}
