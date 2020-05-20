import LoggerModule from './LoggerModule';
import {
  TListenerItem,
  TLogLevels,
  TLogMessage, TListener, TExtendedData
} from './types';


class Logger {
  private __listeners: TListenerItem[] = [];
  private __modules: Record<string, LoggerModule> = {};

  module(moduleName: string) {
    let module = this.getModule(moduleName);

    if (!module) {
      module = new LoggerModule(moduleName, this.__log);
      this.__addModule(module);
    }

    return module;
  }

  getModule(moduleName: string): LoggerModule | null {
    return this.__modules[moduleName] || null;
  }

  getModules() {
    return this.__modules;
  }

  private __addModule(module: LoggerModule) {
    this.__modules[module.name] = module;
  }

  addListener(callback: TListener, levels: TLogLevels[] = []) {
    this.__listeners.push({
      callback,
      levels,
    });
  }

  removeListener(callback: TListener) {
    this.__listeners = this.__listeners.filter((listener) => listener.callback !== callback);
  }

  removeAllListeners() {
    this.__listeners = [];
  }

  __emit = (logMessage: TLogMessage) => {
    this.__listeners.forEach((listener) => {
      if (listener.levels.length === 0) {
        listener.callback(logMessage);
        return;
      }

      if (listener.levels.indexOf(logMessage.level) > -1) {
        listener.callback(logMessage);
        return;
      }

      return;
    });
  };

  __log = (moduleName: string, level: TLogLevels, message: string, extendedData?: TExtendedData) => {
    const logMessage = {
      timestamp: Date.now(),
      level: level,
      moduleName: moduleName,
      message: message,
      extendedData
    };

    this.__emit(logMessage);
  };
}

export default Logger;
