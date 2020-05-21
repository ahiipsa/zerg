import {TLogMessage} from '../types';

export function consoleBrowser(logObject: TLogMessage) {
  const messageString = `[${logObject.moduleName}] ${logObject.message}`;
  console.log(messageString, logObject.extendedData);
}
