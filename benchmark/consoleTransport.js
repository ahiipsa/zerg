var zerg = require('../src');
var transport = require('../src/transport');

var demos = [
    'drone', 'overlord', 'overseer', 'changeling', 'zergling', 'baneling', 'roach', 'ravager', 'hydralisk',
    'lurker', 'swarm host', 'locust', 'queen', 'mutalisk', 'guardian', 'devourer', 'corruptor', 'brood lord', 'viper',
    'scourge', 'defiler', 'queen', 'infestor', 'ultralisk', 'omegalisk', 'pigalisk', 'brutalisk', 'leviathan',
    'broodling', 'infested terran', 'infested colonist', 'infested marine', 'aberration'
];

transport.console.disable(demos.map(function (val) {
    return val + '*'
}));

zerg.use(transport.console);

var logs = [];
logs.push(zerg.create('api'));
logs.push(zerg.create('api:v1'));
logs.push(zerg.create('api:v2'));
logs.push(zerg.create('api:v3'));
logs.push(zerg.create('benchmark'));
logs.push(zerg.create('benchmark:v1'));
logs.push(zerg.create('benchmark:v2'));
logs.push(zerg.create('benchmark:v3'));


const CYCLES = 1000000;
var results = [];
var stat = 0;

// disable console.log
var originConsoleLog = console.log;
console.log = function () {};

for (var k = 0; k < CYCLES; k++) {
    let log = logs[ Math.floor(Math.random() * logs.length) ];
    let start = process.hrtime();

    log.info(`${log.name} message`, 1, true);

    let diff = process.hrtime(start);

    results.push(diff);
}

// enable console.log
console.log = originConsoleLog;

results.forEach(function (val) {
    stat += val[0] * 1e9 + val[1];
});

console.log('avg', stat / results.length);