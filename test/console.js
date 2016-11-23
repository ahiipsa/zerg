'use strict';

/* eslint
 no-console: "off",
 no-unused-expressions: "off",
 no-empty-function: "off",
 global-require: "off",
 no-useless-concat: "off"
 */

var afterEach = require('mocha').afterEach;
var beforeEach = require('mocha').beforeEach;
var chai = require('chai');
var describe = require('mocha').describe;
var expect = require('chai').expect;
var it = require('mocha').it;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var consoleNode = require('../src/transport/consoleNode');
var consoleBrowser = require('../src/transport/consoleBrowser');
var consoleLogOrigin = console.log;

describe('console', function () {
    var logObject = {};

    beforeEach(function () {
        logObject = {
            timestamp: Date.now(),
            name: 'myModule',
            message: 'some message',
            level: 'verbose',
            arguments: []
        };

        console.log = sinon.spy();
    });

    afterEach(function () {
        console.log = consoleLogOrigin;
    });

    describe('transport', function () {
        afterEach(function () {
            delete global.window;
        });

        it('should required consoleBrowser', function () {
            delete require.cache[require.resolve('../src/transport')];
            global.window = true;
            var transport = require('../src/transport');
            var consoleBrowser = require('../src/transport/consoleBrowser');
            expect(transport.console).equal(consoleBrowser);
        });

        it('should required consoleNode', function () {
            delete require.cache[require.resolve('../src/transport')];
            var transport = require('../src/transport');
            var consoleNode = require('../src/transport/consoleNode');
            expect(transport.console).equal(consoleNode);
        });
    });

    describe('consoleNode', function() {
        afterEach(function () {
            logObject.level = 'verbose';
            logObject.arguments = [];
        });

        describe('styles', function () {
            it('should styled string', function () {
                var styles = consoleNode.styles;
                expect(styles.gray('temp')).equal('\u001b[90m' + 'temp' + '\u001b[39m');
                expect(styles.cyan('temp')).equal('\u001b[36m' + 'temp' + '\u001b[39m');
                expect(styles.green('temp')).equal('\u001b[32m' + 'temp' + '\u001b[39m');
                expect(styles.yellow('temp')).equal('\u001b[33m' + 'temp' + '\u001b[39m');
                expect(styles.red('temp')).equal('\u001b[31m' + 'temp' + '\u001b[39m');
            });
        });

        describe('handler', function () {
            it('should called with message and arguments', function () {
                logObject.level = 'verbose';
                logObject.arguments = [1, 'str', true];

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[90m[myModule]\u001b[39m some message', 1, 'str', true);
            });

            it('should called with verbose style', function () {
                logObject.level = 'verbose';

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[90m[myModule]\u001b[39m some message');
            });

            it('should called with debug style', function () {
                logObject.level = 'debug';

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[36m[myModule]\u001b[39m some message');
            });

            it('should called with info style', function () {
                logObject.level = 'info';

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[32m[myModule]\u001b[39m some message');
            });

            it('should called with warn style', function () {
                logObject.level = 'warn';

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[33m[myModule]\u001b[39m some message');
            });

            it('should called with error style', function () {
                logObject.level = 'error';

                consoleNode(logObject);
                expect(console.log).calledWith('\u001b[31m[myModule]\u001b[39m some message');
            });
        });
    });

    describe('consoleBrowser', function() {
        describe('handler', function () {
            it('should called concole.log', function () {
                consoleBrowser(logObject);
                expect(console.log).calledOnce;
            });

            it('should called concole.log with message style "verbose"', function () {
                logObject.level = 'verbose';
                consoleBrowser(logObject);
                var style = {
                    open: 'color: gray; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called concole.log with message style "debug"', function () {
                logObject.level = 'debug';
                consoleBrowser(logObject);
                var style = {
                    open: 'color: cornflowerblue; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called concole.log with message style "info"', function () {
                logObject.level = 'info';
                consoleBrowser(logObject);
                var style = {
                    open: 'color: green; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called concole.log with message style "warning"', function () {
                logObject.level = 'warn';
                consoleBrowser(logObject);
                var style = {
                    open: 'color: orange; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called concole.log with message style "error"', function () {
                logObject.level = 'error';
                consoleBrowser(logObject);
                var style = {
                    open: 'color: red; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });
        });
    });
});
