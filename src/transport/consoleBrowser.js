/* eslint no-console: "off" */
'use strict';

var styles = {
    verbose: 'color: gray; font-weight: bold;',
    debug: 'color: cornflowerblue; font-weight: bold;',
    info: 'color: green; font-weight: bold;',
    error: 'color: red; font-weight: bold;',
    warn: 'color: orange; font-weight: bold;',
    reset: 'color: inherit; font-weight: inherit;'
};


/**
 * @param {LogObject} logObject - {@link LogObject}
 * @returns {undefined}
 */
var handler = function(logObject) {
    var messageString = '%c[' + logObject.name + ']%c ' + logObject.message;
    var args = [messageString, styles[logObject.level], styles.reset].concat(logObject.arguments);

    console.log.apply(console, args);
}

module.exports = handler;