import { resolve } from 'path';
import { getTSConfigPaths } from './tsConfig';

export * from './tsConfig';

export const getJestAliases = (pathToTsConfigFile: string[] = []): string[] => {
  const tsPaths = getTSConfigPaths(pathToTsConfigFile);

  const result: any = {};

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

export const getWebpackAliases = (pathToTsConfigFile: string[] = []): string[] => {
  const tsPaths = getTSConfigPaths(pathToTsConfigFile);

  const result: any = {};

  Object.entries(tsPaths).forEach(([tsPathKey, tsPathValue]) => {
    const key = tsPathKey.replace(/(\/\*)/gi, '');
    if (key === '*') {
      throw new Error('Please remove useless path "*"');
    }
    const folderStructure = tsPathValue[0].replace(/(\/\*)/gi, '');
    const value = resolve(process.cwd(), folderStructure);
    result[key] = value;
  });
  return result;
};
