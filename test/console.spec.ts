/* eslint
 no-console: "off",
 no-unused-expressions: "off",
 no-empty-function: "off",
 global-require: "off",
 no-useless-concat: "off"
 */

import {afterEach, describe, it} from 'mocha'
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {consoleNodeColorful, consoleBrowserColorful} from '../src/transports';
import {TLogMessage} from '../src/types';

const consoleLogOrigin = console.log;

chai.use(sinonChai);

const getLogMessage = (): TLogMessage => {
    return {
        timestamp: Date.now(),
        moduleName: 'myModule',
        message: 'some message',
        level: 'verbose',
        extendedData: {},
    };
};

describe('console', function () {

    beforeEach(() => {
        console.log = sinon.spy();
    });

    afterEach(function () {
        console.log = consoleLogOrigin;
    });

    describe('consoleNodeColorful', function() {

        describe('handler', function () {
            it('should called with message and arguments', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'verbose';
                logMessage.extendedData = {a: 1, b: 'str', c: true};

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[90m[myModule]\u001b[39m some message', {a: 1, b: 'str', c: true});
            });

            it('should called with verbose style', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'verbose';

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[90m[myModule]\u001b[39m some message');
            });

            it('should called with debug style', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'debug';

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[36m[myModule]\u001b[39m some message');
            });

            it('should called with info style', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'info';

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[32m[myModule]\u001b[39m some message');
            });

            it('should called with warn style', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'warn';

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[33m[myModule]\u001b[39m some message');
            });

            it('should called with error style', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'error';

                consoleNodeColorful(logMessage);
                expect(console.log).calledWith('\u001b[31m[myModule]\u001b[39m some message');
            });
        });
    });

    describe('consoleBrowserColorful', function() {
        describe('handler', function () {
            it('should called console.log', function () {
                let logMessage = getLogMessage();
                consoleBrowserColorful(logMessage);
                expect(console.log).calledOnce;
            });

            it('should called console.log with message style "verbose"', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'verbose';
                consoleBrowserColorful(logMessage);
                const style = {
                    open: 'color: gray; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called console.log with message style "debug"', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'debug';
                consoleBrowserColorful(logMessage);
                const style = {
                    open: 'color: cornflowerblue; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called console.log with message style "info"', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'info';
                consoleBrowserColorful(logMessage);
                const style = {
                    open: 'color: green; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called console.log with message style "warning"', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'warn';
                consoleBrowserColorful(logMessage);
                const style = {
                    open: 'color: orange; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });

            it('should called console.log with message style "error"', function () {
                let logMessage = getLogMessage();
                logMessage.level = 'error';
                consoleBrowserColorful(logMessage);
                const style = {
                    open: 'color: red; font-weight: bold;',
                    close: 'color: inherit; font-weight: inherit;'
                };
                expect(console.log).
                calledWith('%c[myModule]%c some message', style.open, style.close);
            });
        });
    });
});
