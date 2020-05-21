[![Build Status](https://travis-ci.org/ahiipsa/zerg.svg?branch=master)](https://travis-ci.org/ahiipsa/zerg)
[![Coverage Status](https://coveralls.io/repos/github/ahiipsa/zerg/badge.svg?branch=master)](https://coveralls.io/github/ahiipsa/zerg?branch=master)
[![npm version](https://badge.fury.io/js/zerg.svg)](https://badge.fury.io/js/zerg)
[![npm downloads](https://img.shields.io/npm/dm/zerg.svg)](https://www.npmjs.com/package/zerg)

# Zerg

Lightweight logging library for apps and libs

## Futures

- Zero dependencies
- TypeScript support
- Easy to use 
- Custom listeners/transports
- Support Node.js and Browsers


## Getting started

### Installation

`npm i --save zerg`

or

`yarn add zerg`

### Usage


Make module `logger.js`:

```js
import zerg from 'zerg';
import {consoleNodeColorful, consoleBrowserColorful} from 'zerg/dist/transports';

const logger = zerg.createLogger();

// Add console logger for node
logger.addListener(consoleNodeColorful);
// Or for browsers
logger.addListener(consoleBrowserColorful);

export default logger;
```

Make your module and import `logger.js`:
```js
import logger from './logger';

const log = logger('moduleName');

log.verbose('verbose message');
log.debug('debug message');
log.info('info message');
log.warn('warn message');
log.error('error message', {foo: 'bar'});
```

Result:

![ScreenShot](https://raw.github.com/ahiipsa/zerg/master/example/example.png)


## API

### Types
 
```
type TExtendedData = Record<string, any>;
```
 
```
type TLogMessage = {
  timestamp: number;
  moduleName: string;
  level: TLogLevels;
  message: string;
  extendedData?: TExtendedData
};
```
 
```
type LogLevels = 'verbose' | 'debug' | 'info' | 'warn' | 'error';
```

```
type Listener = (log: TLogMessage) => void;
```

### addListener(callback: Listener, levels?: LogLevels[]): void;

- callback - function witch calls to each log message
- levels - levels for which the function will be called (default: for all levels)

```js
import zerg from 'zerg';

const logger = zerg.createLogger();

// listen only `info` level 
logger.addListener((logMessage) => {
  console.log(logMessage);
}, ['info']);

logger.module('myModule').info('Info message', {foo: 'bar'});
logger.module('myModule').warn('Warn message', {bar: 'baz'});

/* console
{
  timestamp: 1467967421933,
  level: 'info',
  moduleName: 'myModule',
  message: 'Info message',
  extendedData: {foo: 'bar'},
}
*/

```
### removeListener(callback: TListener): void;
### removeAllListeners(): void;
### module(moduleName: string): LoggerModule;
### getModule(moduleName: string): LoggerModule | null;
### getModules(): Record<string, LoggerModule>;

## Other Examples

### [Sentry](http://sentry.io) transport

```js
const SENTRY_LEVEL_MAP = {
  info: 'info',
  warn: 'warning',
  error: 'error',
  fatal: 'error',
};

function sentryTransport(logMessage) {
  const level = SENTRY_LEVEL_MAP[logMessage.level];

  Sentry.withScope((scope) => {
    scope.setLevel(level);

    Object.keys(logMessage.extendedData).forEach((key) => {
      scope.setExtra(key, logMessage.extendedData[key]); 
    });

    scope.setTag('module', logMessage.moduleName);
    
    Sentry.captureMessage(logMessage.message);
  });
}

logger.addListener(sentryTransport);

```

### Remote debug transport

It is be useful for debug when browser (or device) doesn't provide tool: Android with default browser, WinPhone, SmartTV.

At browser:

```js

function remoteTransport(logMessage) {
  const req = new XMLHttpRequest();
  req.open('POST', 'http://myhost.com:3000/log', false);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(logMessage));
}

logger.addListener(remoteTransport);

```

_Don't forget, host (http://myhost.com:3000/log) must be reachable from device._


At server you may use [express](https://www.npmjs.com/package/express):

```js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // for parsing application/json

app.post('/log', (req, res) => {
    console.log(req.body);
});

app.listen(3000);

```
