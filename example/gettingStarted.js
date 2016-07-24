'use strict';

// setup
var zerg = require('zerg');
var transport = require('zerg/src/transport');
zerg.use(transport.console);

// create log function for module
var log = zerg.create('myAppModule');

// usage
log.verbose('log verbose message');
log.debug('log debug message');
log.info('log info message', 10);
log.warn('log warn message', false);
log.error('log error message', {message: 'something wrong'});