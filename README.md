# Zerg

lightweight logging library


## Futures

- modularity 
- custom transports
- zero dependencies


## Getting started


```js

// setup
var zerg = require('zerg');
var transport = require('zerg/transport');
zerg.use(transport.console);

// create log function for module
var log = zerg.create('myAppModule');


log.debug('log debug message');
log.info('log info message', 10);
log.warn('log warn message', false);
log.error('log error message', {message: 'something wrong'});

```