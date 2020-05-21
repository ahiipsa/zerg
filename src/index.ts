import Logger from './Logger';
import * as transports from './transports';

const createLogger = () => {
  return new Logger();
};

export default {
  createLogger,
};
