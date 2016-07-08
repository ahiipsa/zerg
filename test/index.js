/* eslint no-console: "off", no-empty-function: "off" */

var afterEach = require('mocha').afterEach,
    assert = require('chai').assert,
    beforeEach = require('mocha').beforeEach,
    chai = require('chai'),
    describe = require('mocha').describe,
    it = require('mocha').it,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

var logger = require('../src/index.js');
var transport = require('../src/transport');

/*
var units = [
    'drone', 'overlord', 'overseer', 'changeling', 'zergling', 'baneling', 'roach', 'ravager', 'hydralisk',
    'lurker', 'swarm host', 'locust', 'queen', 'mutalisk', 'guardian', 'devourer', 'corruptor', 'brood lord', 'viper',
    'scourge', 'defiler', 'queen', 'infestor', 'ultralisk', 'omegalisk', 'pigalisk', 'brutalisk', 'leviathan',
    'broodling', 'infested terran', 'infested colonist', 'infested marine', 'aberration'
];
*/

describe('logger', function () {

    beforeEach(function () {
        sinon.spy(console, 'log');
    });

    afterEach(function () {
        console.log.restore();
    });

    it('create log', function () {
        var drone = logger.create('drone');
        assert.isObject(drone, 'drone is function');
    });

    it('log methods', function () {
        var overlord = logger.create('overlord');
        assert.isFunction(overlord.info, 'has info method');
        assert.isFunction(overlord.warn, 'has warn method');
        assert.isFunction(overlord.error, 'has error method');
    });

    it('transports/subscribers', function (done) {
        var overseer = logger.create('overseer');
        var transport = function (msg) {
            assert.isObject(msg);
            assert.isNumber(msg.timestamp, 'has timestamp in number');
            assert.equal(msg.level, 'info');
            assert.equal(msg.name, 'overseer');
            assert.equal(msg.message, 'some message');
            assert.lengthOf(msg.arguments, 0);
            done();
            logger.removeSubscriber(transport);
        };

        logger.use(transport);
        overseer.info('some message');
    });

    it('arguments', function (done) {
        var changeling = logger.create('changeling');
        var fn = function () {};
        var transport = function (msg) {
            assert.equal(msg.message, 'message from changeling');
            assert.lengthOf(msg.arguments, 6);
            assert.equal(msg.arguments[0], false);
            assert.equal(msg.arguments[1], 'string');
            assert.equal(msg.arguments[2], 1);
            assert.isArray(msg.arguments[3]);
            assert.deepEqual(msg.arguments[4], {foo: 'bar'});
            assert.equal(msg.arguments[5], fn);
            done();
            logger.removeSubscriber(transport);
        };

        logger.use(transport);
        changeling.info('message from changeling', false, 'string', 1, [], {foo: 'bar'}, fn);
    });

    it('console styles', function () {
        let codes = transport.console.codes;
        let styles = transport.console.styles;

        for (let styleKey in styles) {
            let codeOpen = codes[styleKey][0];
            let codeClose = codes[styleKey][1];

            assert.equal(styles[styleKey](styleKey), `\u001b[${codeOpen}m${styleKey}\u001b[${codeClose}m`);
        }
    });

    it('console transport', function () {
        logger.use(transport.console);

        let zergling = logger.create('zergling');
        zergling.info('some string', 0, true);

        let styles = transport.console.styles;
        let _message = styles.green('[info][zergling]') + ' some string';

        console.log.should.have.been.calledOnce.calledWith(_message, 0, true);
    });

});
