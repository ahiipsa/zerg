'use strict';

var describe = require('mocha').describe;
var expect = require('chai').expect;
var it = require('mocha').it;
var merge = require('../src/util.js').merge;
var LOG_LEVELS = require('../src/util.js').LOG_LEVELS;

describe('util', function () {
    describe('merge', function () {
        it('should merge objects', function () {
            var a = {
                a: 'a',
                c: 'origin'
            };

            var b = {
                b: 'b',
                c: 'override',
                d: 'new'
            };

            expect(merge(a, b)).eql({
                a: 'a',
                b: 'b',
                c: 'override',
                d: 'new'
            });
        });
    });

    describe('LOG_LEVELS', function () {
        it('should have variables', function () {
            expect(LOG_LEVELS).eql(['verbose', 'debug', 'info', 'warn', 'error']);
        });
    })
});
