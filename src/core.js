'use strict';

var LOG_LEVELS = ['verbose', 'debug', 'info', 'warn', 'error'];

/**
 * @type {Zerg}
 */
var loggerInst = null;

/**
 * @type {Object.<string, Module>}
 * @private
 */
var __modules = {};

/**
 * @type {Array.<Object>}
 * @private
 */
var __transports = [];

/**
 * @type {Array}
 * @private
 */
var __enableRules = [];

/**
 * @typedef {Object} LogObject
 * @property {number} timestamp - Time of create log event
 * @property {string} level - Level of event
 * @property {string} name - Module name with send log event
 * @property {string} message - Message of log event
 * @property {Array.<any>} arguments - Extended info
 */

/**
 * @callback transportCallback
 * @return {undefined}
 */

/**
 * @constructor
 */
var Zerg = function () {
    loggerInst = this;
};

/**
 * Create named Module instance
 * @param {string} moduleName - Name for log function
 * @return {Module} - Instance {@link Module}
 */
Zerg.prototype.module = function(moduleName) {
    var module = this.getModule(moduleName);

    if (!module) {
        module = new Module(moduleName);
        module.enable = this.isModuleEnable(module);
        this.__addModule(module);
    }

    return module;
}

/**
 * @typedef {Object} Rule
 * @property {string} moduleName
 * @property {boolean} namespace
 * @property {boolean} enable
 */

/**
 * @param {string} string - rule string
 * @returns {Rule} rule for module
 */
Zerg.prototype.parseRule = function (string) {
    var isEnable = true;
    var isNameSpace = false;
    var moduleName = string;

    if (!moduleName) {
        moduleName = '*';
    }

    if (moduleName.length !== 1 && moduleName[0] === '-') {
        isEnable = false;
        moduleName = moduleName.substring(1);
    }

    if (moduleName.length !== 1 && moduleName[moduleName.length - 1] === '*') {
        isNameSpace = true;
        moduleName = moduleName.substring(0, moduleName.length - 1)
    }

    return {
        moduleName: moduleName,
        namespace: isNameSpace,
        enable: isEnable
    }
}

/**
 * @param {Array.<string>} rules
 * @returns {undefined}
 */
Zerg.prototype.enable = function (rules) {
    __enableRules = [];
    var rulesLen = rules.length;
    for (var ri = 0; ri < rulesLen; ri++) {
        var rule = this.parseRule(rules[ri]);
        __enableRules.push(rule);
    }

    var modules = loggerInst.getModules();
    var self = this;

    Object.keys(modules).forEach(function (name) {
        var module = modules[name];
        module.enable = self.isModuleEnable(module);
    });
};


/**
 * @param {Module} module
 * @returns {boolean} - is module enable
 */
Zerg.prototype.isModuleEnable = function (module) {
    var rulesCount = __enableRules.length;

    if (!rulesCount) {
        return true;
    }

    for (var i = 0; i < rulesCount; i++) {
        var rule = __enableRules[i];

        if (rule.moduleName === '*') {
            return true;
        }

        if (rule.moduleName === '-') {
            return false;
        }

        if (rule.namespace && module.name.indexOf(rule.moduleName) === 0) {
            return rule.enable;
        }

        if (!rule.namespace && rule.moduleName === module.name) {
            return rule.enable;
        }
    }

    return false;
}

/**
 * @param {string} moduleName - Name of {@link Module}
 * @returns {Module|boolean} - module instance or false if not exist
 */
Zerg.prototype.getModule = function(moduleName) {
    return __modules[moduleName] || false;
}


/**
 * @param {Module} module - instance {@link Module}
 * @private
 * @return {undefined}
 */
Zerg.prototype.__addModule = function(module) {
    __modules[module.name] = module;
}


/**
 * @returns {Object.<string, Module>} - all registered modules
 */
Zerg.prototype.getModules = function() {
    return __modules;
}


/**
 * @param {function} callback - Function for custom transport
 * @param {Array.<string>} [levels] - Function for custom transport
 * @return {undefined}
 */
Zerg.prototype.addTransport = function(callback, levels) {
    if (typeof callback !== 'function') {
        throw new Error('addTransport: callback must be a function');
    }

    var logLevels = [];
    if (typeof levels === 'undefined') {
        logLevels = LOG_LEVELS;
    } else {
        logLevels = levels;
    }

    if (!Array.isArray(logLevels)) {
        throw new Error('addTransport: levels must me array of string')
    }

    __transports.push({
        callback: callback,
        levels: logLevels
    });
}


/**
 * @param {function} callback - Function with transport
 * @return {undefined}
 */
Zerg.prototype.removeTransport = function(callback) {
    for (var i = 0; i < __transports.length; i++) {
        var subscriber = __transports[i];

        if (subscriber.callback === callback) {
            __transports.splice(i, 1);
        }
    }
}


Zerg.prototype.removeAllTransports = function() {
    __transports = [];
}


/**
 * Propagation event for transport
 * @param {LogObject} logInfo - Just LogObject
 * @private
 * @returns {boolean} result
 */
Zerg.prototype.__emit = function(logInfo) {
    var subscriberCount = __transports.length;


    for (var i = 0; i < subscriberCount; i++) {
        var subscriber = __transports[i];
        if (subscriber.levels.indexOf(logInfo.level) > -1) {
            subscriber.callback(logInfo);
        }
    }
}


/**
 * Master function creating LogObject
 * @param {string} moduleName - {@link Module} module name
 * @param {string} level - Level of log
 * @param {string} message - Message of log
 * @param {Array.<any>} args - Extended info
 * @private
 * @return {undefined}
 */
Zerg.prototype.__log = function(moduleName, level, message, args) {
    var logObject = {
        timestamp: Date.now(),
        level: level,
        name: moduleName,
        message: message,
        arguments: args
    };

    this.__emit(logObject);
};


/* eslint valid-jsdoc: ["error", { "requireParamDescription": false }] */

/**
 * @param {string} loggerName
 * @constructor
 */
var Module = function(loggerName) {
    var self = this;
    self.name = loggerName;
    self.enable = true;

    try {
        LOG_LEVELS.forEach(function (level) {
            self[level] = function (message) {
                if (!self.enable) {
                    return;
                }
                var args = Array.prototype.slice.call(arguments, 1);
                loggerInst.__log(self.name, level, message, args);
            }
        });
    } catch (e) {
        console.error('Transport exception occurred', e);
    }
};

module.exports = new Zerg();
