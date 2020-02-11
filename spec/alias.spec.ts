import { getJestAliases, getWebpackAliases, getTSConfigPaths } from '../src/alias';

jest.mock('../src/alias/tsConfig');

describe('testing flat function', () => {
  describe('sucessful invocations', () => {
    it('generates valid aliases for Jest and Webpack', async () => {
      expect.assertions(1);
      (getTSConfigPaths as jest.Mock).mockReturnValue({
        '@root': ['./'],
        '@/*': ['src/*'],
        '@typings': ['typings'],
      });

      // const webpackPath = getWebpackAliases();
      const jestPath = getJestAliases();
      // expect(webpackPath).toStrictEqual({
      //   '@root': `${__dirname}`,
      //   '@': `${__dirname}\\src`,
      //   '@typings': `${__dirname}\\typings`,
      // });
      expect(jestPath).toStrictEqual({
        '@root': '<rootDir>/./',
        '@/(.*)': '<rootDir>/src/$1',
        '@typings': '<rootDir>/typings',
      });
    });
  });

  describe('fail invocations', () => {
    it('generates valid aliases for Jest and Webpack', async () => {
      expect.assertions(1);
      (getTSConfigPaths as jest.Mock).mockReturnValue({
        '*': ['/*'],
        '@root': ['./'],
        '@/*': ['src/*'],
        '@typings': ['typings'],
      });

      try {
        getWebpackAliases();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Please remove useless path "*"'));
      }
    });

    it('generates valid aliases for Jest and Webpack', async () => {
      expect.assertions(1);
      (getTSConfigPaths as jest.Mock).mockReturnValue({
        '*': ['/*'],
        '@root': ['./'],
        '@/*': ['src/*'],
        '@typings': ['typings'],
      });
      try {
        getJestAliases();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Please remove useless path "*"'));
      }
    });
  });
});
