'use strict';

/* eslint no-console: "off", no-empty-function: "off" */

const zerg = require('../src');

const demos = [
    'drone', 'overlord', 'overseer', 'changeling', 'zergling', 'baneling', 'roach', 'ravager', 'hydralisk',
    'lurker', 'swarm host', 'locust', 'queen', 'mutalisk', 'guardian', 'devourer', 'corruptor', 'brood lord', 'viper',
    'scourge', 'defiler', 'queen', 'infestor', 'ultralisk', 'omegalisk', 'pigalisk', 'brutalisk', 'leviathan',
    'broodling', 'infested terran', 'infested colonist', 'infested marine', 'aberration'
];

zerg.enable(demos.map(function (val) {
    return '-' + val + '*'
}));

var logs = [];
logs.push(zerg.module('api'));
logs.push(zerg.module('api:v1'));
logs.push(zerg.module('api:v2'));
logs.push(zerg.module('api:v3'));
logs.push(zerg.module('benchmark'));
logs.push(zerg.module('benchmark:v1'));
logs.push(zerg.module('benchmark:v2'));
logs.push(zerg.module('benchmark:v3'));


const CYCLES = 1000000;
const results = [];

// disable console.log
const originConsoleLog = console.log;
console.log = function () {};

for (let k = 0; k < CYCLES; k++) {
    let log = logs[Math.floor(Math.random() * logs.length)];
    let start = process.hrtime();

    log.info(`${log.name} message`, 1, true);

    let diff = process.hrtime(start);

    results.push(diff[0] * 1e9 + diff[1]);
}

// enable console.log
console.log = originConsoleLog;

var stat = {
    sum: null,
    avg: null,
    min: null,
    max: null
};

// sum
results.forEach(function (val) {
    stat.sum += val;
});

// min / max
results.forEach((val) => {
    if (stat.min === null || val < stat.min) {
        stat.min = val;
    }

    if (stat.max === null || val > stat.max) {
        stat.max = val;
    }
});

stat.avg = Math.round(stat.sum / results.length);

console.log('avg', stat);