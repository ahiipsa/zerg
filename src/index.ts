import Logger from './Logger';
import LogListener from './LogListener';
import {TLogListenerParams} from './types';

const createLogger = () => {
  return new Logger();
};

const createListener = (params: TLogListenerParams) => {
  return new LogListener(params);
};

export default {
  createLogger,
  createListener,
};
