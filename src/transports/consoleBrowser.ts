import {TLogMessage} from '../types';

export function consoleBrowser(logObject: TLogMessage) {
  const prefix =
    logObject.loggerName.length > 0 ? `[${logObject.loggerName}]` : '';
  const message = `${prefix}[${logObject.moduleName}] ${logObject.message}`;

  const args = [message, logObject.extendedData].filter(Boolean);
  console.log(...args);
}
