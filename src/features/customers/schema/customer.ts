import {
  paginatedSchema,
  type Paginated,
} from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import { z } from "zod/v3";

export const customerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "Must be a valid PH mobile number.")
    .min(1, { message: "Phone mobile number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  active: z.boolean(),
  image: z.instanceof(File).nullable(),
});

export const editCustomerSchema = z.object({
  ...customerSchema.omit({ active: true, image: true }).shape,
  image: z.string(),
});

export const customerResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...customerSchema.omit({ image: true }).shape,
  image: z.string(),
});

export const customerTransactionSchema = z.object({
  ...baseResponseDataSchema.shape,
  representative: z.string().optional(),
  totalAmount: z.number(),
  amountPaid: z.number(),
  debtAmount: z.number().optional(),
  creditAmount: z.number().optional(),
  itemCount: z.number(),
});

export const paginatedCustomerSchema = paginatedSchema(customerSchema);

export type Customer = z.infer<typeof customerResponseSchema>;
export type CreateCustomer = z.infer<typeof customerSchema>;
export type EditCustomer = z.infer<typeof editCustomerSchema>;
export type CustomerTransaction = z.infer<typeof customerTransactionSchema>;
export type PaginatedCustomer = Paginated<Customer>;
export type PaginatedCustomerTransaction = Paginated<CustomerTransaction>;
