"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.getTSConfigPaths = (pathToFile) => {
    var _a, _b;
    try {
        const requirePath = pathToFile.length > 0 ? path_1.resolve(...pathToFile) : path_1.resolve(process.cwd(), 'tsconfig.json');
        const tsConfig = require(`${requirePath}`);
        const tsPaths = (_b = (_a = tsConfig) === null || _a === void 0 ? void 0 : _a.compilerOptions) === null || _b === void 0 ? void 0 : _b.paths;
        if (!tsPaths) {
            throw new Error("Paths property doesn't exist in tsconfig file");
        }
        return tsPaths;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Please remove all the comments from tsconfig.json file or validate it against JSON spec');
        }
        throw new Error(error);
    }
};
