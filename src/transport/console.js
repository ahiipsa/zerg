'use strict';
var util = require('util');

/* eslint no-console: "off", max-statements: ["error", 13] */

var codes = {
    reset: [0, 0],
    cyan: [36, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39]
};

var styles = {};

Object.keys(codes).forEach(function (key) {
    var open = `\u001b[${codes[key][0]}m`;
    var close = `\u001b[${codes[key][1]}m`;

    styles[key] = (function (open, close) {
        return function (string) {
            return open + string + close;
        }
    })(open, close);
});

var map = {
    debug: styles.cyan,
    error: styles.red,
    info: styles.green,
    warn: styles.yellow
};

var moduleEnable = false;
var moduleDisable = false;


/**
 * Enable/Disable module in console.log
 * @param {Array<string>} modules - List of modules to disable
 * @return {void}
 */
var enable = function (modules) {
    moduleEnable = false;
    moduleDisable = false;

    let disabled = [];
    let enabled = [];
    for (let i = 0; i < modules.length; i++) {
        let moduleName = modules[i];

        if (moduleName.indexOf('-') === 0) {
            disabled.push(moduleName.slice(1).replace('*', '[\\w\\W]*'));
        } else {
            enabled.push(moduleName.replace('*', '[\\w\\W]*'));
        }
    }

    if (enabled.length > 0) {
        moduleEnable = new RegExp(`^(${enabled.join('|')})$`);
    }

    if (disabled.length > 0) {
        moduleDisable = new RegExp(`^(${disabled.join('|')})$`);
    }
};

/**
 * @param {LogObject} logObject Object of log event
 * @return {void}
 */
var handler = function (logObject) {
    if (moduleEnable && !moduleEnable.test(logObject.name)) {
        return;
    }

    if (moduleDisable && moduleDisable.test(logObject.name)) {
        return;
    }

    let style = map[logObject.level];
    let message = style(`[${logObject.level}][${logObject.name}]`) + ' ' + logObject.message;
    let args = [message].concat(logObject.arguments);
    console.log.apply(console, args);
};

handler.styles = styles;
handler.codes = codes;
handler.disable = util.deprecate(() => {
    console.log('ERROR: zerg.disable: use zerg.enable');
}, 'zerg.disable: use zerg.enable');
handler.enable = enable;

module.exports = handler;
