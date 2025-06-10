import { AxiosResponse } from 'axios';
import { ZodSchema } from 'zod';

export const parseResponse = async <T>(
  req: Promise<AxiosResponse<unknown>>, 
  schema: ZodSchema<T>
): Promise<T> => {
  const res = await req;
  return schema.parse(res.data);
};