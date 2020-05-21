/* eslint no-console: "off" */
import {TLogMessage} from '../types';

const styles = {
  verbose: 'color: gray; font-weight: bold;',
  debug: 'color: cornflowerblue; font-weight: bold;',
  info: 'color: green; font-weight: bold;',
  error: 'color: red; font-weight: bold;',
  warn: 'color: orange; font-weight: bold;',
  reset: 'color: inherit; font-weight: inherit;',
};

export function consoleBrowserColorful(logObject: TLogMessage) {
  const messageString =
    '%c[' + logObject.moduleName + ']%c ' + logObject.message;
  console.log(
    messageString,
    styles[logObject.level],
    styles.reset,
    logObject.extendedData
  );
}
