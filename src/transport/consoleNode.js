'use strict';

/* eslint no-console: "off" */

var codes = {
    reset: [0, 0],
    cyan: [36, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    gray: [90, 39]
};

var styles = {};

Object.keys(codes).forEach(function (key) {
    var open = '\u001b[' + codes[key][0] + 'm';
    var close = '\u001b[' + codes[key][1] + 'm';

    styles[key] = (function (open, close) {
        return function (string) {
            return open + string + close;
        }
    })(open, close);
});

var map = {
    verbose: styles.gray,
    debug: styles.cyan,
    error: styles.red,
    info: styles.green,
    warn: styles.yellow
};

/**
 * @param {LogObject} logObject - Object of log event
 * @return {void}
 */
var handler = function (logObject) {
    var style = map[logObject.level];
    var message = style('[' + logObject.name + ']') + ' ' + logObject.message;
    var args = [message].concat(logObject.arguments);
    console.log.apply(console, args);
};

handler.styles = styles;
handler.codes = codes;

module.exports = handler;