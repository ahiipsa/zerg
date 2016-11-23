'use strict';

// setup
const zerg = require('zerg');

// create log function for module
const log = zerg.module('myAppModule');

// usage
log.verbose('verbose message');
log.debug('debug message');
log.info('info message', 10);
log.warn('warn message', false);
log.error('error message', {foo: 'bar'});