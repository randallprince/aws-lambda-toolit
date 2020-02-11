const BASE_HOST_ENV_VAR = 'API_BASE_URL';
const BASE_HOST_NAME = 'the-host';

process.env[BASE_HOST_ENV_VAR] = BASE_HOST_NAME;

import { href } from '../src/href';

describe('service.href', () => {
  describe('buildHref', () => {
    describe('with valid data', () => {
      it('buildHref returns expect string', async () => {
        const type = 'test-type';
        const id = 'test-id';

        const result = href.buildHref(type, id);

        expect(result).toEqual(`${BASE_HOST_NAME}/${type}/${id}`);
      });
    });

    describe('with invalid data', () => {
      it('buildHref fails when passed a null type', async () => {
        const type = (null as any) as string;
        const id = 'test-id';

        expect(() => {
          href.buildHref(type, id);
        }).toThrow('Type is not a valid string');
      });

      it('buildHref fails when passed a null guid', async () => {
        const type = 'test-type';
        const id = (null as any) as string;

        expect(() => {
          href.buildHref(type, id);
        }).toThrow('GUID is not a valid string');
      });

      it('buildHref fails when passed an undefined type', async () => {
        const type = (undefined as any) as string;
        const id = 'test-id';

        expect(() => {
          href.buildHref(type, id);
        }).toThrow('Type is not a valid string');
      });

      it('buildHref fails when passed an undefined guid', async () => {
        const type = 'test-type';
        const id = (undefined as any) as string;

        expect(() => {
          href.buildHref(type, id);
        }).toThrow('GUID is not a valid string');
      });
    });
  });
});
