'use strict';

var zerg = require('zerg');
var log = zerg.create('mySupperModule');

zerg.use(function (logObject) {
    console.dir(logObject);
});

log.info('create staff', true, 1, ['array'], {foo: 'bar'});