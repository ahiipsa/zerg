'use strict';

const consoleNode = require('./consoleNode');
const consoleBrowser = require('./consoleBrowser');

let console = consoleNode;
if (typeof window !== 'undefined') {
    console = consoleBrowser;
}

module.exports = {console};