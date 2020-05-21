import LoggerModule from './LoggerModule';
import LogListener from './LogListener';
import {TLogLevel, TLogMessage, TExtendedData} from './types';

class Logger {
  private __listeners: LogListener[] = [];
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

  addListener(listener: LogListener) {
    this.__listeners.push(listener);
  }

  removeListener(listener: LogListener) {
    this.__listeners = this.__listeners.filter((item) => item !== listener);
  }

  removeAllListeners() {
    this.__listeners = [];
  }

  __emit = (logMessage: TLogMessage) => {
    this.__listeners.forEach((listener) => {
      listener.notify(logMessage);
    });
  };

  __log = (
    moduleName: string,
    level: TLogLevel,
    message: string,
    extendedData?: TExtendedData
  ) => {
    const logMessage = {
      timestamp: Date.now(),
      level: level,
      moduleName: moduleName,
      message: message,
      extendedData,
    };

    this.__emit(logMessage);
  };
}

export default Logger;
