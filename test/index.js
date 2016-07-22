'use strict';

/* eslint no-console: "off", no-empty-function: "off", global-require: "off", no-unused-expressions
: off */

var afterEach = require('mocha').afterEach,
    assert = require('chai').assert,
    beforeEach = require('mocha').beforeEach,
    chai = require('chai'),
    describe = require('mocha').describe,
    it = require('mocha').it,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    transport = require('../src/transport'),
    zerg = require('../src/index.js');

chai.use(sinonChai);
chai.should();

/*
var units = [
    'drone', 'overlord', 'overseer', 'changeling', 'zergling', 'baneling', 'roach', 'ravager', 'hydralisk',
    'lurker', 'swarm host', 'locust', 'queen', 'mutalisk', 'guardian', 'devourer', 'corruptor', 'brood lord', 'viper',
    'scourge', 'defiler', 'queen', 'infestor', 'ultralisk', 'omegalisk', 'pigalisk', 'brutalisk', 'leviathan',
    'broodling', 'infested terran', 'infested colonist', 'infested marine', 'aberration'
];
*/

describe('logger', function () {

    it('singleton', function () {
        let zergCopy = require('../src/index.js');
        zergCopy.should.to.be.equal(zerg);
    });

    it('create log', function () {
        var drone = zerg.create('drone');
        assert.isObject(drone, 'drone is function');
    });

    it('create log copy', function () {
        let ravager = zerg.create('ravager');
        let ravagerCopy = zerg.create('ravager');

        ravager.should.to.be.equal(ravagerCopy);
    });

    it('get logs functions', function () {
        let logs = zerg.getLogs();

        for (let i = 0; i < logs.length; i++) {
            let log = logs[i];
            log.to.have.property('name');
            log.to.have.property('debug');
            log.to.have.property('info');
            log.to.have.property('warn');
            log.to.have.property('error');
        }

    });

    it('log methods', function () {
        var overlord = zerg.create('overlord');
        assert.isFunction(overlord.debug, 'has info method');
        assert.isFunction(overlord.info, 'has info method');
        assert.isFunction(overlord.warn, 'has warn method');
        assert.isFunction(overlord.error, 'has error method');
    });

    describe('transport', function () {

        it('add new transport', function (done) {
            var overseer = zerg.create('overseer');
            var transport = function (msg) {
                assert.isObject(msg);
                assert.isNumber(msg.timestamp, 'has timestamp in number');
                assert.equal(msg.level, 'info');
                assert.equal(msg.name, 'overseer');
                assert.equal(msg.message, 'some message');
                assert.lengthOf(msg.arguments, 0);
                done();
                zerg.removeSubscriber(transport);
            };

            zerg.use(transport);
            overseer.info('some message');

            zerg.use.should.throw(/use: callback must be a function/);
        });

        it('delete not existing transport remove', function () {
            zerg.removeSubscriber(function () {});
        });

        it('arguments after message', function (done) {
            var changeling = zerg.create('changeling');
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
                zerg.removeSubscriber(transport);
            };

            zerg.use(transport);
            changeling.info('message from changeling', false, 'string', 1, [], {foo: 'bar'}, fn);
        });

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

    describe('console transport', function () {

        beforeEach(function () {
            sinon.spy(console, 'log');
            transport.console.enable([]);
            zerg.use(transport.console);
        });

        afterEach(function () {
            zerg.removeSubscriber(transport.console);
            console.log.restore();
        });

        it('console transport', function () {
            let zergling = zerg.create('zergling');
            zergling.info('some string', 0, true);

            let styles = transport.console.styles;
            let _message = styles.green('[info][zergling]') + ' some string';

            console.log.should.have.been.calledOnce.calledWith(_message, 0, true);
            zerg.removeSubscriber(transport.console);
        });

        it('disable', function () {
            transport.console.enable(['-baneling']);

            let styles = transport.console.styles;
            let baneling = zerg.create('baneling');
            let _message = styles.green('[info][baneling]') + ' some string';
            baneling.info('some string');

            console.log.should.not.have.been.calledWith(_message);

            transport.console.enable([]);

            baneling.info('some string');

            console.log.should.have.been.calledWith(_message);
        });

        it('disable with wildcard', function () {
            transport.console.enable(['-roach*']);

            let roach = zerg.create('roach:v1');
            roach.info('some string');

            let styles = transport.console.styles;
            let _message = styles.green('[info][roach:v1]') + ' some string';
            console.log.should.not.have.been.calledWith(_message);

            transport.console.enable([]);

            roach.info('some string');

            console.log.should.have.been.calledWith(_message);
        });

        it('enable', function () {
            transport.console.enable(['hydralisk']);

            zerg.create('hydralisk').info('some string');
            zerg.create('swarm host').info('swarm host here');
            zerg.create('locust').info('locust logging');

            let styles = transport.console.styles;
            let _message = styles.green('[info][hydralisk]') + ' some string';
            console.log.should.have.been.calledOnce.calledWith(_message);
        });

        it('enable with wildcard', function () {
            transport.console.enable(['queen*']);

            zerg.create('queen:1').info('some string');
            zerg.create('queen:2').info('some string');
            zerg.create('queen:3').info('some string');

            zerg.create('swarm host').info('swarm host here');
            zerg.create('locust').info('locust logging');

            console.log.should.have.been.calledThrice;
        });

    });

});
