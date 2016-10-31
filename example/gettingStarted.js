// setup
const zerg = require('zerg');

// create log function for module
const log = zerg.module('myAppModule');

// usage
log.verbose('log verbose message');
log.debug('log debug message');
log.info('log info message', 10);
log.warn('log warn message', false);
log.error('log error message', {message: 'something wrong'});