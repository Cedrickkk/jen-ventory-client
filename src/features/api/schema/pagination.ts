import { z } from "zod/v3";

/**
 * Schema factory for paginated response
 */
export const paginatedSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    content: z.array(schema),
    page: z.object({
      size: z.number(),
      number: z.number(),
      totalElements: z.number(),
      totalPages: z.number(),
    }),
  });
};

export const pageParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
});

export type PageParamsSchema = z.infer<typeof pageParamsSchema>;

export type Paginated<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
