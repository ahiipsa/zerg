'use strict';

/* eslint
    no-console: "off",
    no-unused-expressions: "off",
    no-empty-function: "off",
    max-lines: "off"
*/

var afterEach = require('mocha').afterEach;
var beforeEach = require('mocha').beforeEach;
var chai = require('chai');
var describe = require('mocha').describe;
var expect = require('chai').expect;
var it = require('mocha').it;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var zerg = require('../src/index.js');

chai.use(sinonChai);

describe('zerg', function () {

    var consoleLogOrigin = console.log;

    beforeEach(function () {
        console.log = sinon.spy();
        zerg.removeAllTransports();
        zerg.config({console: true});
    });

    afterEach(function () {
        console.log = consoleLogOrigin;
    });

    describe('zerg.module', function () {
        it('should return module', function () {
            var log = zerg.module('myModule');
            expect(log.verbose).to.be.a('function');
            expect(log.debug).to.be.a('function');
            expect(log.info).to.be.a('function');
            expect(log.warn).to.be.a('function');
            expect(log.error).to.be.a('function');
            expect(log.name).to.equal('myModule');
        });

        it('should not create duplicate', function () {
            expect(zerg.module('ravager')).equal(zerg.module('ravager'));
        });
    });

    describe('zerg.getModules', function () {
        it('should return object with module', function () {
            var ultralisk = zerg.module('ultralisk');
            expect(zerg.getModules()).property('ultralisk');
            expect(zerg.getModules().ultralisk).equal(ultralisk);
        });
    });

    describe('zerg.parseRule', function () {
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

    describe('zerg.enable', function () {
        it('should enable one module', function () {
            zerg.enable(['hydralisk']);

            zerg.module('hydralisk').info('some string');
            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            expect(console.log).to.have.been.calledOnce;
        });

        it('should disable module', function () {
            zerg.enable(['-baneling']);
            zerg.module('baneling').info('some string');
            zerg.module('baneling').info('some string');
            zerg.module('baneling').info('some string');
            zerg.module('other').info('some string');
            expect(console.log).to.have.been.calledOnce;
        });

        it('should disable namespace', function () {
            zerg.enable(['-roach*']);

            zerg.module('roach:v1').info('some string');
            zerg.module('roach:v2').info('some string');
            zerg.module('roach:v3').info('some string');
            zerg.module('other').info('some string');
            expect(console.log).to.have.been.called;
        });

        it('should enable namespace', function () {
            zerg.enable(['queen*']);

            zerg.module('queen').info('some string');
            zerg.module('queen:1').info('some string');
            zerg.module('queen:2').info('some string');

            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            expect(console.log).calledThrice;
        });

        it('should disable all', function () {
            zerg.enable(['-']);

            zerg.module('queen:1').info('some string');
            zerg.module('queen:2').info('some string');
            zerg.module('queen:3').info('some string');
            zerg.module('swarm host').info('swarm host here');
            zerg.module('locust').info('locust logging');

            expect(console.log).notCalled;
        });

        it('should enable all', function () {
            zerg.enable(['*']);

            zerg.module('v123').info('some string');
            zerg.module('v124').info('some string');
            zerg.module('v124:1').info('some string');
            zerg.module('v125:2').info('some string');
            zerg.module('v126:3').info('some string');
            zerg.module('v127:4').info('some string');

            expect(console.log).callCount(6);
        });
    });

    describe('zerg.addTransport', function () {
        it('should add transport', function () {
            var overseer = zerg.module('overseer');
            var transport = sinon.spy();

            zerg.addTransport(transport);
            overseer.info('some message', false, 'string', 1, [], {foo: 'bar'});
            expect(transport).calledOnce.calledWithMatch({
                name: 'overseer',
                level: 'info',
                message: 'some message',
                arguments: [false, 'string', 1, [], {foo: 'bar'}]
            });
            zerg.removeTransport(transport);
        });

        it('should add transport to levels', function () {
            var transport = sinon.spy();
            zerg.addTransport(transport, ['error']);

            zerg.module('infestor').verbose('some string');
            zerg.module('infestor').debug('some string');
            zerg.module('infestor').info('some string');
            zerg.module('infestor').warn('some string');
            zerg.module('infestor').error('some string');

            expect(transport).not.calledWithMatch({level: 'verbose'});
            expect(transport).not.calledWithMatch({level: 'debug'});
            expect(transport).not.calledWithMatch({level: 'info'});
            expect(transport).not.calledWithMatch({level: 'warn'});
            expect(transport).calledOnce.calledWithMatch({level: 'error'});
        });

        it('should throw error when called without param', function() {
            expect(zerg.addTransport).throws(/addTransport: callback must be a function/);
        });

        it('should throw error when called with invalid level', function () {
            expect(function () {
                zerg.addTransport(function () {}, 1)
            }).throws(/addTransport: levels must me array of string/);
        });
    });

    describe('zerg.removeTransport', function () {
        it('should delete transport', function () {
            var transport = sinon.spy();

            zerg.addTransport(transport);
            zerg.removeTransport(transport);
            zerg.module('temp').info('im here');
            expect(transport).not.called;
        });

        it('should not throw when delete transport', function () {
            var transport = sinon.spy();
            zerg.addTransport(transport);
            expect(function () {
                zerg.removeTransport(transport);
            }).not.throws();
        });

        it('should not throw when delete NOT existing transport', function () {
            zerg.removeTransport(function () {});
        });
    });

    describe('zerg.removeAllTransport', function () {
        it('should delete all transports', function() {
            var t1 = sinon.spy();
            var t2 = sinon.spy();

            zerg.addTransport(t1);
            zerg.addTransport(t2);
            zerg.removeAllTransports();

            zerg.module('temp1').info('some message');

            expect(t1).not.called;
            expect(t2).not.called;
        });

        it('should not throw error', function() {
            expect(function () {
                zerg.removeAllTransports()
            }).not.throws();
        });
    });

    describe('zerg.config', function () {
        it('should disable/enable console.log', function () {
            zerg.config({console: false});
            zerg.module('myModule').info('some message');
            expect(console.log).not.called;

            zerg.config({console: true});
            zerg.module('myModule').info('some message');
            zerg.module('myModule').info('some message');
            expect(console.log).calledTwice;
        });

        it('should not throw error', function () {
            expect(zerg.config).not.throws();
        });

        it('should transport only info level', function () {
            zerg.config({
                console: true,
                consoleLevels: ['info']
            });

            zerg.module('myModule').verbose('verbose message');
            zerg.module('myModule').debug('debug message');
            zerg.module('myModule').info('info message');
            zerg.module('myModule').warn('warn message');
            zerg.module('myModule').error('error message');
            expect(console.log).calledOnce.calledWithMatch(/info message/);
        })
    });
});
