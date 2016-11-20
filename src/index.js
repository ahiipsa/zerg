'use strict';

var zerg = require('./core');
var transport = require('./transport');

zerg.addTransport(transport.console);

/**
 * @param {object} opt - for config
 * @param {boolean} opt.console - disable/enable console transport
 * @return {undefined}
 */
zerg.config = function (opt) {
    var options = opt || {};
    if ({}.hasOwnProperty.call(options, 'console')) {

        zerg.removeTransport(transport.console);

        if (options.console) {
            zerg.addTransport(transport.console);
        }
    }
}

module.exports = zerg;