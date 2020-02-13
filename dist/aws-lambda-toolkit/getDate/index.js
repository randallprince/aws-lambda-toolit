"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns Date in cookbook complaint ISO string format.
 * @tutorial
 * For testing: you can spyOn Date.now() which this function uses internally
 * or you can mock this function directly.
 * @example
 * // __Mocking example__
 * jest.spyOn(Date, 'now').mockReturnValue(1479427200000);
 * @returns 2016-11-18T00:00:00.000Z
 */
exports.getDate = () => {
    return new Date(Date.now()).toISOString();
};
