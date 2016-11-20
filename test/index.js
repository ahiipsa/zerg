'use strict';

/* eslint no-console: "off", no-empty-function: "off", global-require: "off", no-unused-expressions
: off, no-process-env: "off", max-lines: "off"*/

var afterEach = require('mocha').afterEach,
    assert = require('chai').assert,
    beforeEach = require('mocha').beforeEach,
    chai = require('chai'),
    consoleBrowserTransport = require('../src/transport/consoleBrowser'),
    describe = require('mocha').describe,
    expect = require('chai').expect,
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

const consoleLogOrigin = console.log;
const consoleLogFake = () => {};

describe('logger', function () {

    it('singleton', function () {
        let zergCopy = require('../src/index.js');
        zergCopy.should.to.be.equal(zerg);
    });

    it('create log', function () {
        var drone = zerg.module('drone');
        drone.should.to.be.a('object');
    });

    it('create log copy', function () {
        let ravager = zerg.module('ravager');
        let ravagerCopy = zerg.module('ravager');

        ravager.should.to.be.equal(ravagerCopy);
    });

    it('get logs functions', function () {
        let logs = zerg.getModules();

        for (let i = 0; i < logs.length; i++) {
            let log = logs[i];
            log.should.to.have.property('name');
            log.should.to.have.property('debug');
            log.should.to.have.property('info');
            log.should.to.have.property('warn');
            log.should.to.have.property('error');
        }

    });

    it('log methods', function () {
        var overlord = zerg.module('overlord');
        assert.isFunction(overlord.verbose, 'has verbose method');
        assert.isFunction(overlord.debug, 'has info method');
        assert.isFunction(overlord.info, 'has info method');
        assert.isFunction(overlord.warn, 'has warn method');
        assert.isFunction(overlord.error, 'has error method');
    });

    describe('parseRule', function () {
        it('enable all', function() {
            var rule = {
                moduleName: '*',
                namespace: false,
                enable: true
            };

            expect(zerg.parseRule('*')).eql(rule);
            expect(zerg.parseRule('')).eql(rule);
            expect(zerg.parseRule()).eql(rule);
        });

        it('disable all', function () {
            var rule = {
                moduleName: '-',
                namespace: false,
                enable: true
            };

            expect(zerg.parseRule('-')).eql(rule);
        });

        it('enable module', function () {
            var rule = {
                moduleName: 'db',
                namespace: false,
                enable: true
            };

            expect(zerg.parseRule('db')).eql(rule);
        });

        it('disable module', function () {
            var rule = {
                moduleName: 'db',
                namespace: false,
                enable: false
            };

            expect(zerg.parseRule('-db')).eql(rule);
        });

        it('enable module namespace', function () {
            var rule = {
                moduleName: 'db',
                namespace: true,
                enable: true
            };

            expect(zerg.parseRule('db*')).eql(rule);
        });

        it('disable module namespace', function () {
            var rule = {
                moduleName: 'db',
                namespace: true,
                enable: false
            };

            expect(zerg.parseRule('-db*')).eql(rule);
        });
    });

    describe('transport', function () {

        beforeEach(function () {
            console.log = consoleLogFake;
            zerg.removeAllTransports();
            zerg.config({console: true});
        });

        afterEach(function () {
            console.log = consoleLogOrigin;
        });

        it('add new transport', function (done) {
            let overseer = zerg.module('overseer');
            let newTransport = (logObject) => {
                logObject.should.to.be.a('object');
                logObject.timestamp.should.to.be.a('number');
                logObject.level.should.to.be.a('string').and.equal('info');
                logObject.name.should.to.be.a('string').and.equal('overseer');
                logObject.message.should.to.be.a('string').and.equal('some message');
                logObject.arguments.should.to.be.length(3);
                zerg.removeTransport(newTransport);
                done();
            };

            zerg.addTransport(newTransport);
            overseer.info('some message', true, 1, ['a', 'b', 'c']);

            zerg.addTransport.should.throw(/addTransport: callback must be a function/);
        });

        it('bad levels parameter', function () {
            let badTransport = function () {
                zerg.addTransport(() => true, 1);
            };

            badTransport.should.throw(/addTransport: levels must me array of string/);
        });

        it('delete existing transport', function () {
            let transport = () => true;
            zerg.addTransport(transport);
            zerg.removeTransport(transport);
        });

        it('remove all transports', () => {
            const t1 = () => {};
            const t2 = () => {};

            expect(() => {
                zerg.removeAllTransports()
            }).not.throw();

            expect(() => {
                zerg.removeTransport(t1)
            }).not.throw;
            expect(() => {
                zerg.removeTransport(t2)
            }).not.throw;
        });

        it('delete NOT existing transport', function () {
            zerg.removeTransport(function () {});
        });

        it('subscribe to levels', function () {
            let showLevel = sinon.spy();

            zerg.addTransport((logObject) => {
                showLevel(logObject.level);
            }, ['info']);

            zerg.module('infestor').verbose('some string');
            zerg.module('infestor').debug('some string');
            zerg.module('infestor').info('some string');
            zerg.module('infestor').warn('some string');
            zerg.module('infestor').error('some string');

            showLevel.should.have.been.calledWith('info');
            showLevel.should.not.have.been.calledWith('error');
        });

        it('arguments after message', function (done) {
            var changeling = zerg.module('changeling');
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
                zerg.removeTransport(transport);
            };

            zerg.addTransport(transport);
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
            console.log = consoleLogFake;
            sinon.spy(console, 'log');
        });

        afterEach(function () {
            console.log.restore();
            console.log = consoleLogOrigin;
        });

        it('console transport', function () {
            zerg.enable(['*']);
            let zergling = zerg.module('zergling');
            zergling.info('some string', 0, true);

            let styles = transport.console.styles;
            let _message = styles.green('[zergling]') + ' some string';

            console.log.should.have.been.calledOnce.calledWith(_message, 0, true);
        });

        it('console browser style', function () {
            const logObject = {
                timestamp: Date.now(),
                level: 'info',
                name: 'testStyle',
                message: 'some string',
                arguments: [1, '123']
            };

            consoleBrowserTransport(logObject);
            const message = `%c[${logObject.name}]%c ${logObject.message}`;
            const styleInfo = 'color: green; font-weight: bold;';
            const resetStyle = 'color: inherit; font-weight: inherit;';

            console.log.
                should.have.been.calledOnce.
                calledWith(message, styleInfo, resetStyle, logObject.arguments[0], logObject.arguments[1]);
        });

        it('console browser require', function () {
            transport.console.should.not.equal(consoleBrowserTransport);

            global.window = true;
            delete require.cache[require.resolve('../src/transport')];
            transport = require('../src/transport');
            transport.console.should.equal(consoleBrowserTransport);

            delete global.window;
            delete require.cache[require.resolve('../src/transport')];
            transport = require('../src/transport');
        });

        it('console transport disable/enable', function () {
            zerg.config({console: false});
            zerg.module('disableConsoleTransport').info('disable');
            console.log.should.not.have.been.called;

            zerg.config({console: true});
            zerg.module('disableConsoleTransport').info('enable');
            console.log.should.have.been.called.once;

            zerg.config.should.not.throw();
        });

        it('disable', function () {
            zerg.enable(['-baneling']);

            let styles = transport.console.styles;
            let baneling = zerg.module('baneling');
            let _message = styles.green('[baneling]') + ' some string';
            baneling.info('some string');

            console.log.should.not.have.been.calledWith(_message);

            zerg.enable([]);

            baneling.info('some string');

            console.log.should.have.been.calledWith(_message);
        });

        it('disable with wildcard', function () {
            zerg.enable(['-roach*']);

            let roach = zerg.module('roach:v1');
            roach.info('some string');

            let styles = transport.console.styles;
            let _message = styles.green('[roach:v1]') + ' some string';
            console.log.should.not.have.been.calledWith(_message);

            zerg.enable([]);

            roach.info('some string');

            console.log.should.have.been.calledWith(_message);
        });

        it('enable', function () {
            zerg.enable(['hydralisk']);

            zerg.module('hydralisk').info('some string');
            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            let styles = transport.console.styles;
            let _message = styles.green('[hydralisk]') + ' some string';
            console.log.should.have.been.calledOnce.calledWith(_message);
        });

        it('enable with wildcard', function () {
            zerg.enable(['queen*']);

            zerg.module('queen:1').info('some string');
            zerg.module('queen:2').info('some string');
            zerg.module('queen:3').info('some string');

            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            console.log.should.have.been.calledThrice;
        });

        it('disable with minus', function () {
            zerg.enable(['-']);

            zerg.module('queen:1').info('some string');
            zerg.module('queen:2').info('some string');
            zerg.module('queen:3').info('some string');

            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            console.log.should.not.have.been.called;
        });

    });

});
