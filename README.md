[![Build Status](https://travis-ci.org/ahiipsa/zerg.svg?branch=master)](https://travis-ci.org/ahiipsa/zerg)
[![Coverage Status](https://coveralls.io/repos/github/ahiipsa/zerg/badge.svg?branch=master)](https://coveralls.io/github/ahiipsa/zerg?branch=master)
[![npm version](https://badge.fury.io/js/zerg.svg)](https://badge.fury.io/js/zerg)
[![npm downloads](https://img.shields.io/npm/dm/zerg.svg)](https://www.npmjs.com/package/zerg)

# Zerg

lightweight logging library for apps and libs

## Futures

- modularity 
- custom transports
- zero dependencies


## Getting started

### Install

`npm i zerg --save`

### Setup

```js

// setup
const zerg = require('zerg');

// create log function for module
const log = zerg.create('myAppModule');

// usage
log.verbose('log verbose message');
log.debug('log debug message');
log.info('log info message', 10);
log.warn('log warn message', false);
log.error('log error message', {message: 'something wrong'});

```

result:

![ScreenShot](https://raw.github.com/ahiipsa/zerg/master/example/example.png)


### Enable/Disable module

you can disable some log by module name, example:

```js

// bootstrap.js
const zerg = require('zerg');

// enable log only for api
zerg.enable(['api']);

// or use wildcard
zerg.enable(['api*']);

// disable log for api
zerg.enable(['-api']);
// or use wildcard
zerg.enable(['-api*']);

// combination
zerg.enable(['perfix:*', 'api', '-db', '-http']);

// src/api.js
const zerg = require('zerg');
const log = zerg.create('api');


// src/db.js
const zerg = require('zerg');
const log = zerg.create('db');

```

## Transports

### Custom transport


Simple example for preview data format:

```js

const zerg = require('zerg');
const log = zerg.create('mySupperModule');

const myCustomTransport = function (logObject) {
    // do something with logObject
    console.dir(logObject);
};


zerg.addTransport(myCustomTransport, ['error']);

log.error('create staff', true, 1, ['array'], {foo: 'bar'});

```

result:

```js

{
    timestamp: 1467967421933,
    level: 'error',
    name: 'mySuperModule',
    message: 'create staff',
    arguments: [ true, 1, [ 'array' ], { foo: 'bar' } ]
}

```

You can create your self transport for level, modules, environments
when is needed:

```js

zerg.addTransport(function (logObject) {
    if(NODE_ENV === 'production' && logObject.level === 'error') {
        // write to file
    } else if (NOVE_ENV !== 'production') {
        // write to console
    }
});

log.info('create staff', {foo: 'bar'});

```
