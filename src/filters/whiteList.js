/* eslint max-statements: ["error", 13], no-process-env: "off" */
'use strict';

let enableRegExp = new RegExp();
let disableReqExp = new RegExp();

let whiteList = [];
let blackList = [];

/**
 * Enable/Disable {@link Module}
 * @param {Array.<string>} modules - List of modules to disable
 * @return {void}
 */
const enable = function (modules) {

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

const isEnableModule = function (logObject) {

    if (blackList.length && disableReqExp.test(logObject.name)) {
        return false;
    }

    return !whiteList.length || whiteList.length && enableRegExp.test(logObject.name);
};

module.exports.enable = enable;
module.exports.isEnableModule = isEnableModule;