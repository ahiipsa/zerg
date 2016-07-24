'use strict';

/**
 * @type {Zerg}
 */
var loggerInst = null;

/**
 * @type {Object.<Log>}
 * @private
 */
var __logs = {};

/**
 * @type {array<Log>}
 * @private
 */
var __subscribers = [];


/**
 * @typedef {object} LogObject
 * @property {number} timestamp Time of create log event
 * @property {string} level Level of event
 * @property {string} name Module name with send log event
 * @property {string} message Message of log event
 * @property {array<any>} event.arguments Extended info
 */


/**
 * @callback transportCallback
 * @return {undefined}
 */


class Zerg {

    constructor() {
        loggerInst = this;
    }


    /**
     * Create named Log instance
     * @param {string} loggerName - Name for log function
     * @return {Log} - Instance Log function
     */
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


    /**
     * @param {transportCallback} callback - Function for custom transport
     * @return {undefined}
     */
    use(callback) {
        if (typeof callback !== 'function') {
            throw new Error('use: callback must be a function');
        }
        __subscribers.push(callback);
    }


    /**
     * @param {function} callback - Function with transport
     * @return {undefined}
     */
    removeSubscriber(callback) {
        let index = __subscribers.indexOf(callback);
        if (index !== -1) {
            __subscribers.splice(index, 1);
        }
    }


    /**
     * Propagation event for transport
     * @param {LogObject} logInfo - Just LogObject
     * @private
     * @return {undefined}
     */
    __emit(logInfo) {
        for (let i = 0; i < __subscribers.length; i++) {
            __subscribers[i](logInfo);
        }
    }


    /**
     * Master function creating LogObject
     * @param {string} moduleName - Log module name
     * @param {string} level - Level of log
     * @param {name} message - Message of log
     * @param {array<any>} args - Extended info
     * @private
     * @return {undefined}
     */
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

const levels = ['verbose', 'debug', 'info', 'warn', 'error'];

/**
 * Zerg module
 */
class Log {
    constructor(loggerName) {
        this.name = loggerName;

        levels.forEach((level) => {
            this[level] = function (message) {
                let args = Array.prototype.slice.call(arguments, 1);
                loggerInst.__log(this.name, level, message, args);
            }
        });
    }
}

module.exports = new Zerg();
