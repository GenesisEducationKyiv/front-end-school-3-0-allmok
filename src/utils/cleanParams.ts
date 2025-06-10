import { O, D, S } from '@mobily/ts-belt';

export const cleanParams = <T extends Record<string, unknown>>(params: T): Partial<T> => {
  return D.filter(params, (value: unknown): boolean => {
    if (O.isNone(value)) {
      return false;
    }
    if (typeof value === 'string' && S.isEmpty(value)) {
      return false;
    }
    return true;
  });
};