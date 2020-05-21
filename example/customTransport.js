/* eslint no-console: "off" */
'use strict';

const zerg = require('zerg');

const log = zerg.module('mySupperModule');

const myCustomTransport = function (logObject) {
  // do something with logObject
  console.dir(logObject);
};

zerg.addTransport(myCustomTransport, ['error', 'warn']);

log.error('create staff', true, 1, ['array'], {foo: 'bar'});
