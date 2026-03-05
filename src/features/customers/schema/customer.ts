import {
  paginatedSchema,
  type Paginated,
} from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import { z } from "zod/v3";

export const customerSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  active: z.boolean(),
});

export const customerResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...customerSchema.shape,
});

export const paginatedCustomerSchema = paginatedSchema(customerSchema);

export type Customer = z.infer<typeof customerResponseSchema>;
export type CreateCustomer = z.infer<typeof customerSchema>;
export type PaginatedCustomer = Paginated<Customer>;
