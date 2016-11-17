'use strict';

var consoleNode = require('./consoleNode');
var consoleBrowser = require('./consoleBrowser');

var console = consoleNode;
if (typeof window !== 'undefined') {
    console = consoleBrowser;
}

module.exports = {console: console};