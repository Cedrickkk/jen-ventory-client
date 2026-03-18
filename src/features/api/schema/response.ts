import { z } from "zod/v3";

export const baseResponseDataSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const baseApiResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  message: z.string(),
  meta: z.object({
    requestId: z.string(),
    timestamp: z.date(),
  }),
});

export const successResponseSchema = <T extends z.ZodType>(dataShape: T) =>
  z.object({
    ...baseApiResponseSchema.shape,
    data: dataShape.nullable(),
  });

export const errorResponseSchema = z.object({
  ...baseApiResponseSchema.shape,
  errors: z.record(z.string(), z.string()).nullable(),
});

export type BaseResponseData = z.infer<typeof baseResponseDataSchema>;
export type BaseApiResponse = z.infer<typeof baseApiResponseSchema>;
export type SuccessApiResponse<T> = BaseApiResponse & {
  data?: T;
};
export type ErrorApiResponse<T = Record<string, string>> = BaseApiResponse & {
  errors: T | null;
};
