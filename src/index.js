'use strict';

const zerg = require('./core');
const transport = require('./transport');
const filters = require('./filters');

zerg.addFilter(filters.whiteList.isEnableModule);
zerg.addTransport(transport.console);
zerg.enable = filters.whiteList.enable;

module.exports = zerg;