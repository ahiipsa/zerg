import {
  TLogLevel,
  TLogMessage,
  TLogMessageHandler,
  TLogListenerFilter,
  TLogListenerParams,
} from './types';

class LogListener {
  levels: TLogLevel[];
  handler: TLogMessageHandler;
  filter: TLogListenerFilter | null;

  constructor({levels = [], handler, filter}: TLogListenerParams) {
    this.levels = levels;
    this.handler = handler;
    this.filter = filter || null;
  }

  notify(logMessage: TLogMessage) {
    if (this.filter) {
      this.filter(logMessage) ? this.handler(logMessage) : null;
      return;
    }

    if (this.levels.length === 0) {
      this.handler(logMessage);
      return;
    }

    if (this.levels.indexOf(logMessage.level) > -1) {
      this.handler(logMessage);
      return;
    }
  }
}

export default LogListener;
