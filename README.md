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
import {
  consoleNodeColorful,
  consoleBrowserColorful,
} from 'zerg/dist/transports';

const logger = zerg.createLogger();

// Add console logger
const listener = zerg.createListener({
  handler: consoleBrowserColorful, // for browser
  // handler: consoleNodeColorful, // for node
});

logger.addListener(listener);

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
  loggerName: string;
  moduleName: string;
  level: TLogLevel;
  message: string;
  extendedData?: TExtendedData
};
```

```
type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';
```

```
type Listener = (log: TLogMessage) => void;
```

### zerg.createLogger(): Logger - Create logger instance

### zerg.createListener(params): LogListener - Create listener for logger

- params.handler: (logMessage: TLogMessage) => void;
- params.filter?: (logMessage: TLogMessage) => boolean; (optional)
- params.levels?: LogLevel; (optional)

### logger.addListener(listener: LogListener)

```js
import zerg from 'zerg';

const logger = zerg.createLogger();

const listener = zerg.createListener({
  handler: (logMessage) => console.log(logMessage),
  levels: ['info'], // listen only `info` level
});

logger.addListener(listener);

logger.module('myModule').info('Info message', {foo: 'bar'});
logger.module('myModule').warn('Warn message', {bar: 'baz'});
logger.module('myModule').error('Error message');

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

Use filter - Listen messages only from "Sarah" module

```js
import zerg from 'zerg';

const logger = zerg.createLogger();

const listener = zerg.createListener({
  handler: (logMessage) => console.log(logMessage),
  filter: (logMessage) => logMessage.moduleName === 'Sarah', // listen messages only from "Sarah" module
  // levels: [], // at this case levels are ignoring
});

logger.addListener(listener);

logger.module('Alice').info('Info message', {foo: 'bar'});
logger.module('Bob').warn('Warn message', {bar: 'baz'});
logger.module('Sarah').error('Error message');

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

### removeListener(LogListener): void;

### removeAllListeners(): void;

### module(moduleName: string): LoggerModule;

### getModule(moduleName: string): LoggerModule | null;

### getModules(): Record<string, LoggerModule>;

## Other Examples

### [Sentry](http://sentry.io) transport

```js
import zerg from 'zerg';
const logger = zerg.createLogger();

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

const listener = zerg.createListener({handler: sentryTransport});

logger.addListener(listener);
```

### Remote debug transport

It is be useful for debug when browser (or device) doesn't provide tool: Android with default browser, WinPhone, SmartTV.

At browser:

```js
import zerg from 'zerg';
const logger = zerg.createLogger();

function remoteTransport(logMessage) {
  const req = new XMLHttpRequest();
  req.open('POST', 'http://myhost.com:3000/log', false);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(logMessage));
}

const listener = zerg.createListener({handler: remoteTransport});

logger.addListener(listener);
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
