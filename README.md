[![Build Status](https://travis-ci.org/ahiipsa/zerg.svg?branch=master)](https://travis-ci.org/ahiipsa/zerg)
[![Coverage Status](https://coveralls.io/repos/github/ahiipsa/zerg/badge.svg?branch=master)](https://coveralls.io/github/ahiipsa/zerg?branch=master)
[![npm version](https://badge.fury.io/js/zerg.svg)](https://badge.fury.io/js/zerg)
[![npm downloads](https://img.shields.io/npm/dm/zerg.svg)](https://www.npmjs.com/package/zerg)

# Zerg

## Futures

- modularity 
- custom transports
- zero dependencies


## Getting started

### Install

`npm i --save zerg`

### Setup

```js

// setup
var zerg = require('zerg');
var transport = require('zerg/src/transport');
zerg.use(transport.console);

// create log function for module
var log = zerg.create('myAppModule');

// usage
log.debug('log debug message');
log.info('log info message', 10);
log.warn('log warn message', false);
log.error('log error message', {message: 'something wrong'});

```

result:

![ScreenShot](https://raw.github.com/ahiipsa/zerg/master/example/example.png)

### Custom transport


Simple example for preview data format:

```js

var zerg = require('zerg');
var log = zerg.create('mySupperModule');

zerg.use(function (logObject) {

    console.dir(logObject);
    
});

log.info('create staff', true, 1, ['array'], {foo: 'bar'});

```

result:

```js

{
    timestamp: 1467967421933,
    level: 'info',
    name: 'mySuperModule',
    message: 'create staff',
    arguments: [ true, 1, [ 'array' ], { foo: 'bar' } ]
}

```

You can create your self transport for level, modules, environments
when is needed:

```js

zerg.use(function (logObject) {
    if(NODE_ENV === 'production' && logObject.level === 'error') {
        // write to file
    } else if (NOVE_ENV !== 'production') {
        // write to console
    }
});

log.info('create staff', {foo: 'bar'});

```


## Transports

zerg have some inbox transport 

## Console

### Setup

```js

// bootstrap.js

var zerg = require('zerg');
var transport = require('zerg/src/transport');
zerg.use(transport.console);

```

### Enable/Disable module

you can disable some log by module name, example:

```js

// bootstrap.js
var zerg = require('zerg');
var transport = require('zerg/src/transport');
zerg.use(transport.console);

// enable log only for api
transport.console.enable(['api']);

// or use wildcard 
transport.console.enable(['api*']);

// disable log for api
transport.console.enable(['-api']);
// or use wildcard
transport.console.enable(['-api*']);

// combination
transport.console.enable(['perfix:*', 'api', '-db', '-http']);

// src/api.js
var zerg = require('zerg');
var log = zerg.create('api');


// src/db.js
var zerg = require('zerg');
var log = zerg.create('db');

```