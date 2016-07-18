'use strict';

/* eslint no-console: "off" */

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

var validate = false;

/**
 * @param {LogObject} event Object of log event
 * @return {undefined}
 */
var handler = function (event) {
    if (validate && validate.test(event.name)) {
        return;
    }

    let style = map[event.level];
    let message = style(`[${event.level}][${event.name}]`) + ' ' + event.message;
    let args = [message].concat(event.arguments);
    console.log.apply(console, args);
};

/**
 * Disable module in console.log
 * @param {array<string>} modules List of modules to disable
 * @return {undefined}
 */
var disable = function (modules) {
    let result = [];

    // build
    for (let i = 0; i < modules.length; i++) {
        let moduleName = modules[i];
        // moduleName* to regexp: moduleName[\w\W]*
        moduleName = moduleName.replace('*', '[\\w\\W]*');
        result.push(moduleName);
    }

    // save for usage ^(a|b[\w\W]*|c)
    validate = new RegExp(`^(${result.join('|')})$`);
};

handler.styles = styles;
handler.codes = codes;
handler.disable = disable;

module.exports = handler;
