import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import z from "zod/v3";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});

export const productResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...productSchema.shape,
  active: z.boolean(),
});

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive(),
  size: z.string().optional(),
  flavor: z.string().optional(),
  packaging: z.string().optional(),
});

export const productVariantResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...productVariantSchema.shape,
  productId: z.number(),
  productName: z.string(),
  stockQuantity: z.number(),
  active: z.boolean(),
});

export type Product = z.infer<typeof productResponseSchema>;
export type CreateProduct = z.infer<typeof productSchema>;
export type PaginatedProduct = Paginated<Product>;

export type ProductVariant = z.infer<typeof productVariantResponseSchema>;
export type CreateProductVariant = z.infer<typeof productVariantSchema>;
export type PaginatedProductVariant = Paginated<ProductVariant>;
