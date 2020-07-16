export type TLogLevel =
  | 'verbose'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'metric'
  | 'event';

export type TExtendedData = Record<string, any>;

export type TLogMessage = {
  timestamp: number;
  loggerName: string;
  moduleName: string;
  level: TLogLevel;
  message: string;
  extendedData?: TExtendedData;
};

export type TLogFunction = (
  moduleName: string,
  level: TLogLevel,
  message: string,
  extendedData?: TExtendedData
) => void;

export type TLogMessageHandler = (logMessage: TLogMessage) => void;

export type TLogListenerFilter = (logMessage: TLogMessage) => boolean;

export type TLogListenerParams = {
  levels?: TLogLevel[];
  filter?: TLogListenerFilter;
  handler: TLogMessageHandler;
};
