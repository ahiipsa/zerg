'use strict';

/* eslint no-console: "off" */

import {TLogMessage} from '../types';
import {objectKeys} from '../utils';

const codes = {
  reset: [0, 0],
  cyan: [36, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  gray: [90, 39],
};

const styles: Record<string, (m: string) => string> = {
  reset: () => '',
  cyan: () => '',
  red: () => '',
  green: () => '',
  yellow: () => '',
  gray: () => '',
};

objectKeys(codes).forEach((key) => {
  const open = '\u001b[' + codes[key][0] + 'm';
  const close = '\u001b[' + codes[key][1] + 'm';

  const makeStyle = (open: string, close: string) => (message: string) =>
    open + message + close;
  styles[key] = makeStyle(open, close);
});

const map = {
  verbose: styles.gray,
  debug: styles.cyan,
  error: styles.red,
  info: styles.green,
  warn: styles.yellow,
};

export function consoleNodeColorful(logObject: TLogMessage) {
  const style = map[logObject.level];
  const message =
    style('[' + logObject.moduleName + ']') + ' ' + logObject.message;
  console.log(message, logObject.extendedData);
}
