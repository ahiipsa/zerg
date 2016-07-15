'use strict';

let loggerInst = null;
let __logs = {};
let __subscribers = [];

class Logger {

    constructor() {
        loggerInst = this;
    }


    create(loggerName) {
        let log = this.getLog(loggerName);
        if (log === false) {
            log = new Log(loggerName);
            this.__addLog(log);
        } else {
            log = this.getLog(loggerName);
        }

        return log;
    }


    getLog(logName) {
        return __logs[logName] || false;
    }


    __addLog(log) {
        __logs[log.name] = log;
    }


    getLogs() {
        return __logs;
    }


    use(callback) {
        if (typeof callback !== 'function') {
            throw new Error('use: callback must be a function');
        }
        __subscribers.push(callback);
    }


    removeSubscriber(callback) {
        let index = __subscribers.indexOf(callback);
        if (index !== -1) {
            __subscribers.splice(index, 1);
        }
    }


    __emit(logInfo) {
        for (var i = 0; i < __subscribers.length; i++) {
            __subscribers[i](logInfo);
        }
    }


    __log(moduleName, level, message, args) {
        let logObject = {
            timestamp: Date.now(),
            level: level,
            name: moduleName,
            message: message,
            arguments: args
        };

        this.__emit(logObject);
    }

}

const levels = {
    'debug': {},
    'info': {},
    'warn': {},
    'error': {}
};

class Log {
    constructor(loggerName) {
        this.name = loggerName;

        for (let level in levels) {
            this[level] = function (message) {
                var args = Array.prototype.slice.call(arguments, 1);
                loggerInst.__log(this.name, level, message, args);
            }
        }
    }
}

module.exports = new Logger();
