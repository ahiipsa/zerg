## 2.0.0

Migration:

1. Logger create

```diff
const zerg = require('zerg');

+ const logger = zerg.createLogger();
- const log = zerg.module('myAppModule');
+ const log = logger.module('myAppModule');

log.verbose('verbose message');
```

2. Transport to console

By default zerg@2.0 don't have any listeners(transports)

```diff
const zerg = require('zerg');
+ const {consoleBrowserColorful} = require('zerg/dist/transports');

+ const listener = zerg.createListener({
+   handler: consoleBrowserColorful,
+ });
+ const logger = zerg.createLogger();
+ logger.addListener(listener);
- const log = zerg.module('myAppModule');
+ const log = logger.module('myAppModule');

log.verbose('verbose message');
```

Changes:

- Refactoring to TypeScript
- Remove unused code
- Refactoring listeners

## 1.8.1 (March 4, 2017)

- Updated README.md

## 1.8.0 (November 27, 2016)

- Added ability to specify levels logging for console transport

## 1.7.0 (November 24, 2016)

- Fixed bud with zerg.enable(['-moduleName']), it should disable only one module
- Prettified tests

## 1.6.0 (November 21, 2016)

- Refactored zerg.enable modules (boost)

## 1.5.0 (November 18, 2016)

- Returned to ES5 for support old browsers
