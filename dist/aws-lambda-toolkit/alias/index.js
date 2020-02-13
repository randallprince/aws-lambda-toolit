"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const tsConfig_1 = require("./tsConfig");
__export(require("./tsConfig"));
exports.getJestAliases = (pathToTsConfigFile = []) => {
    const tsPaths = tsConfig_1.getTSConfigPaths(pathToTsConfigFile);
    const result = {};
    Object.entries(tsPaths).forEach(([tsPathKey, tsPathValue]) => {
        const key = tsPathKey.replace(/(\/\*)/gi, '/(.*)');
        if (key === '*') {
            throw new Error('Please remove useless path "*"');
        }
        const uncleanValue = `<rootDir>/${tsPathValue[0].replace(/(\/\*)/gi, '/$$1')}`;
        const value = uncleanValue.replace(/\/\//, '/');
        result[key] = value;
    });
    return result;
};
exports.getWebpackAliases = (pathToTsConfigFile = []) => {
    const tsPaths = tsConfig_1.getTSConfigPaths(pathToTsConfigFile);
    const result = {};
    Object.entries(tsPaths).forEach(([tsPathKey, tsPathValue]) => {
        const key = tsPathKey.replace(/(\/\*)/gi, '');
        if (key === '*') {
            throw new Error('Please remove useless path "*"');
        }
        const folderStructure = tsPathValue[0].replace(/(\/\*)/gi, '');
        const value = path_1.resolve(process.cwd(), folderStructure);
        result[key] = value;
    });
    return result;
};
