/* eslint
    no-console: "off",
    no-unused-expressions: "off",
    no-empty-function: "off",
    max-lines: "off"
*/

import {afterEach, describe, it} from 'mocha';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import zerg from '../dist';
import {TLogMessage} from '../src/types';

chai.use(sinonChai);

const logger = zerg.createLogger();

describe('Zerg', function () {
  const consoleLogOrigin = console.log;

  beforeEach(function () {
    console.log = sinon.spy();
    logger.removeAllListeners();
  });

  afterEach(function () {
    console.log = consoleLogOrigin;
  });

  describe('logger.module', function () {
    it('should return module', function () {
      const log = logger.module('myModule');
      expect(log.verbose).to.be.a('function');
      expect(log.debug).to.be.a('function');
      expect(log.info).to.be.a('function');
      expect(log.warn).to.be.a('function');
      expect(log.error).to.be.a('function');
      expect(log.name).to.equal('myModule');
    });

    it('should not create duplicate', function () {
      expect(logger.module('ravager')).equal(logger.module('ravager'));
    });
  });

  describe('logger.getModules', function () {
    it('should return object with module', function () {
      const ultralisk = logger.module('ultralisk');
      expect(logger.getModules()).property('ultralisk');
      expect(logger.getModules().ultralisk).equal(ultralisk);
    });
  });

  describe('logger.addListener', function () {
    it('should add listener', function () {
      const overseer = logger.module('overseer');

      const handler = sinon.spy();
      const listener = zerg.createListener({handler});

      logger.addListener(listener);
      overseer.info('some message', {
        a: false,
        b: 'string',
        c: 1,
        d: [],
        e: {foo: 'bar'},
      });
      expect(handler).calledOnce.calledWithMatch({
        loggerName: '',
        moduleName: 'overseer',
        level: 'info',
        message: 'some message',
        extendedData: {a: false, b: 'string', c: 1, d: [], e: {foo: 'bar'}},
      });
      logger.removeListener(listener);
    });

    it('should add listeners to levels', function () {
      const handler = sinon.spy();
      const listener = zerg.createListener({handler, levels: ['error']});
      logger.addListener(listener);

      logger.module('infestor').verbose('some string');
      logger.module('infestor').debug('some string');
      logger.module('infestor').info('some string');
      logger.module('infestor').warn('some string');
      logger.module('infestor').error('some string');

      expect(handler).calledOnce.calledWithMatch({level: 'error'});
    });

    it('should add listener with filter', () => {
      const handler = sinon.spy();
      const filter = (logMessage: TLogMessage) => {
        return (
          logMessage.moduleName === 'infestor@salt03' &&
          logMessage.level === 'info'
        );
      };
      const listener = zerg.createListener({
        handler,
        filter,
        levels: ['error'],
      });
      logger.addListener(listener);

      logger.module('infestor@salt01').verbose('some string');
      logger.module('infestor@salt02').debug('some string');
      logger.module('infestor@salt03').info('some string');
      logger.module('infestor@salt02').warn('some string');
      logger.module('infestor@salt01').error('some string');

      expect(handler).calledOnce.calledWithMatch({
        level: 'info',
        moduleName: 'infestor@salt03',
      });
    });
  });

  describe('logger.removelistener', function () {
    it('should delete listeners', function () {
      const handler = sinon.spy();
      const listener = zerg.createListener({handler, levels: ['error']});

      logger.addListener(listener);
      logger.removeListener(listener);
      logger.module('temp').info('im here');
      expect(handler).not.called;
    });

    it('should not throw when delete listeners', function () {
      const handler = sinon.spy();
      const listener = zerg.createListener({handler});

      logger.addListener(listener);
      expect(function () {
        logger.removeListener(listener);
      }).not.throws();
    });

    it('should not throw when delete NOT existing listeners', function () {
      const handler = sinon.spy();
      const listener = zerg.createListener({handler, levels: ['error']});
      logger.removeListener(listener);
    });
  });

  describe('logger.removeAllListeners', function () {
    it('should delete all listeners', function () {
      const t1 = sinon.spy();
      const t2 = sinon.spy();

      const listener1 = zerg.createListener({handler: t1});
      const listener2 = zerg.createListener({handler: t2});

      logger.addListener(listener1);
      logger.addListener(listener2);
      logger.removeAllListeners();

      logger.module('temp1').info('some message');

      expect(t1).not.called;
      expect(t2).not.called;
    });

    it('should not throw error', function () {
      expect(() => {
        logger.removeAllListeners();
      }).not.throws();
    });
  });
});
