import { resolve } from 'path';

export const getTSConfigPaths = (pathToFile: string[]): string[] => {
  try {
    const requirePath = pathToFile.length > 0 ? resolve(...pathToFile) : resolve(process.cwd(), 'tsconfig.json');
    const tsConfig = require(`${requirePath}`);
    const tsPaths: string[] | undefined = tsConfig?.compilerOptions?.paths;
    if (!tsPaths) {
      throw new Error("Paths property doesn't exist in tsconfig file");
    }
    return tsPaths;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Please remove all the comments from tsconfig.json file or validate it against JSON spec');
    }
    throw new Error(error);
  }
};
