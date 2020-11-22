import logguer from 'basic-log';
import { getRootPath } from './getRootPath';

export function getScriptsFolder(): string {
	const rootPath = getRootPath();
	const scriptFolder = `${rootPath}/../../scripts`;
	logguer.d('getScriptsFolder:', scriptFolder);
	return scriptFolder;
}
