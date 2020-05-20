export type TLogLevels = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export type TExtendedData = Record<string, any>;

export type TLogMessage = {
  timestamp: number;
  moduleName: string;
  level: TLogLevels;
  message: string;
  extendedData?: TExtendedData
};

export type TLogFunction = (moduleName: string, level: TLogLevels, message: string, extendedData?: TExtendedData) => void;

export type TListener = (log: TLogMessage) => void;

export type TListenerItem = {
  callback: TListener;
  levels: TLogLevels[];
}
