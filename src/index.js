'use strict';

var LOG_LEVELS = require('./util').LOG_LEVELS;
var merge = require('./util').merge;

/**
 * @type {Zerg}
 */
var zerg = require('./core');
var transport = require('./transport');

zerg.addTransport(transport.console);

/**
 * @param {object} opt - for config
 * @param {boolean} opt.console - disable/enable console transport
 * @return {undefined}
 */
zerg.config = function (opt) {
    var options = merge({
        console: true,
        consoleLevels: LOG_LEVELS
    }, opt || {});

    if ({}.hasOwnProperty.call(options, 'console')) {
        zerg.removeTransport(transport.console);

        if (options.console) {
            zerg.addTransport(transport.console, options.consoleLevels);
        }
    }
}

module.exports = zerg;