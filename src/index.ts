import Logger from './Logger';
import LogListener from './LogListener';
import {TLogListenerParams} from './types';

const createLogger = (name?: string) => {
  return new Logger(name);
};

const createListener = (params: TLogListenerParams) => {
  return new LogListener(params);
};

export default {
  createLogger,
  createListener,
};
