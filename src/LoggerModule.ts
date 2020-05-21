import {TLogLevel, TExtendedData, TLogFunction} from './types';

class LoggerModule {
  name: string;
  readonly __originLog: TLogFunction;

  constructor(name: string, logFn: TLogFunction) {
    this.name = name;
    this.__originLog = logFn;
  }

  private log(level: TLogLevel, message: string, extendedData?: TExtendedData) {
    this.__originLog(this.name, level, message, extendedData);
  }

  verbose(message: string, extendedData?: TExtendedData) {
    this.log('verbose', message, extendedData);
  }
  debug(message: string, extendedData?: TExtendedData) {
    this.log('debug', message, extendedData);
  }
  info(message: string, extendedData?: TExtendedData) {
    this.log('info', message, extendedData);
  }
  warn(message: string, extendedData?: TExtendedData) {
    this.log('warn', message, extendedData);
  }
  error(message: string, extendedData?: TExtendedData) {
    this.log('error', message, extendedData);
  }
}

export default LoggerModule;
