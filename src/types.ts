export type TLogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export type TExtendedData = Record<string, any>;

export type TLogMessage = {
  timestamp: number;
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

export type TLogListenerParams = {
  levels?: TLogLevel[];
  filter?: TLogListenerFilter;
  handler: TLogMessageHandler;
};

export type TLogMessageHandler = (log: TLogMessage) => void;

export type TLogListenerFilter = (logMessage: TLogMessage) => boolean;
