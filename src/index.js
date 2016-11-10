'use strict';

const zerg = require('./core');
const transport = require('./transport');
const filters = require('./filters');

zerg.addFilter(filters.whiteList.isEnableModule);
zerg.enable = filters.whiteList.enable;

zerg.addTransport(transport.console);

/**
 * @param {object} opt - for config
 * @param {boolean} opt.console - disable/enable console transport
 * @return {undefined}
 */
zerg.config = (opt) => {
    const options = Object.assign({}, opt || {});
    if ({}.hasOwnProperty.call(options, 'console')) {

        zerg.removeTransport(transport.console);

        if (options.console) {
            zerg.addTransport(transport.console);
        }
    }
}

module.exports = zerg;