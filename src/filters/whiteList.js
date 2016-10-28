/* eslint max-statements: ["error", 13], no-process-env: "off" */
'use strict';

var enableRegExp = new RegExp();
var disableReqExp = new RegExp();

let whiteList = [];
let blackList = [];

/**
 * Enable/Disable module in console.log
 * @param {Array.<string>} modules - List of modules to disable
 * @return {void}
 */
var enable = function (modules) {

    blackList = [];
    whiteList = [];

    for (let i = 0; i < modules.length; i++) {
        let moduleName = modules[i];

        if (moduleName.indexOf('-') === 0) {
            blackList.push(
                moduleName.slice(1).replace('*', '[\\w\\W]*')
            );
        } else {
            whiteList.push(
                moduleName.replace('*', '[\\w\\W]*')
            );
        }
    }

    if (whiteList.length > 0) {
        enableRegExp = new RegExp(`^(${whiteList.join('|')})$`);
    }

    if (blackList.length > 0) {
        disableReqExp = new RegExp(`^(${blackList.join('|')})$`);
    }
};

var isEnableModule = function (logObject) {

    if (blackList.length && disableReqExp.test(logObject.name)) {
        return false;
    }

    if (!whiteList.length || (whiteList.length && enableRegExp.test(logObject.name))) {
        return true;
    }

    return false;
};

/**
 * Enable module from process.env.DEBUG and compatibility with npm "debug" package
 */
//if (process.env.DEBUG) {
//    let debug = process.env.DEBUG;
//    let modules = debug.split(',').map((item) => item.trim());
//    enable(modules);
//}

module.exports.enable = enable;
module.exports.isEnableModule = isEnableModule;