'use strict';

var zerg = require('zerg');
var log = zerg.create('mySupperModule');
var myCustomTransport = function (logObject) {
    // do something with logObject
    console.dir(logObject);
};

zerg.use(myCustomTransport, ['error', 'warn']);

log.error('create staff', true, 1, ['array'], {foo: 'bar'});