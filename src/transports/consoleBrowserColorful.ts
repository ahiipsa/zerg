/* eslint no-console: "off" */
import {TLogMessage} from '../types';

const styles = {
  verbose: 'color: gray; font-weight: bold;',
  debug: 'color: cornflowerblue; font-weight: bold;',
  info: 'color: green; font-weight: bold;',
  error: 'color: red; font-weight: bold;',
  warn: 'color: orange; font-weight: bold;',
  metric: 'color: gray; font-weight: bold;',
  event: 'color: gray; font-weight: bold;',
  reset: 'color: inherit; font-weight: inherit;',
};

export function consoleBrowserColorful(logObject: TLogMessage) {
  const prefix =
    logObject.loggerName.length > 0 ? `[${logObject.loggerName}]` : '';
  const message = `${prefix}%c[${logObject.moduleName}]%c ${logObject.message}`;

  const args = [
    message,
    styles[logObject.level],
    styles.reset,
    logObject.extendedData,
  ].filter(Boolean);
  console.log(...args);
}
