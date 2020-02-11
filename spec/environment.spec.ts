import { env } from '../src/environment';

let ENV_VAR_NAME: any = 'FOO';
let ENV_VAR_VALUE: any = 'BAR';

describe('service.environment', () => {
  beforeEach(() => {
    ENV_VAR_NAME = 'FOO';
    ENV_VAR_VALUE = 'BAR';

    process.env[ENV_VAR_NAME] = ENV_VAR_VALUE;
  });

  describe('getEnvironmentVar', () => {
    describe('with valid data', () => {
      it('returns the correct value when the environment variable is set', async () => {
        const ENV_VAR_RESULT = env.getEnvironmentVar(ENV_VAR_NAME);

        expect(ENV_VAR_RESULT).toBe(ENV_VAR_VALUE);
      });
    });

    describe('with invalid data', () => {
      it('correctly throws error with no environment variable set', async () => {
        delete process.env[ENV_VAR_NAME];

        const e = env.getEnvironmentVar(ENV_VAR_NAME);

        expect(e).toBe('');
      });

      it('correctly throws error with invalid environment name variable type (non-string)', async () => {
        expect(() => {
          // @ts-ignore - for testing invalid run-time types
          env.getEnvironmentVar(true);
        }).toThrow('true is not a valid environment variable');
      });
    });
  });

  describe('setEnvironmentVar', () => {
    describe('with valid data', () => {
      it('the correct environment value is set', async () => {
        env.setEnvironmentVar(ENV_VAR_NAME, ENV_VAR_VALUE);

        expect(process.env[ENV_VAR_NAME]).toBe(ENV_VAR_VALUE);
      });
    });

    describe('with invalid data', () => {
      it('correctly throws error with an invalid name type (non-string)', async () => {
        ENV_VAR_NAME = true;
        expect(() => {
          // @ts-ignore - for testing invalid run-time types
          env.setEnvironmentVar(ENV_VAR_NAME, ENV_VAR_VALUE);
        }).toThrow('true is not a valid environment variable');
      });

      it('correctly throws error with an invalid value type (non-string)', async () => {
        ENV_VAR_VALUE = {};
        expect(() => {
          // @ts-ignore - for testing invalid run-time types
          env.setEnvironmentVar(ENV_VAR_NAME, ENV_VAR_VALUE);
        }).toThrow('[object Object] is not a valid environment variable value');
      });
    });
  });
});
