import type { Paginated } from "@/features/api/schema/pagination";
import { baseResponseDataSchema } from "@/features/api/schema/response";
import z from "zod/v3";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.instanceof(File).nullable(),
});

export const productResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...productSchema.omit({ image: true }).shape,
  active: z.boolean(),
  variantCount: z.number(),
  image: z.string(),
});

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive(),
  size: z.string().optional(),
  flavor: z.string().optional(),
  packaging: z.string().optional(),
  image: z.instanceof(File).nullable(),
});

export const stockMovementTypeSchema = z.enum([
  "RESTOCK",
  "SOLD",
  "ADJUSTMENT",
  "RETURN",
]);

export const adjustmentDirectionSchema = z.enum(["ADD", "DEDUCT"]);

export const restockRequestSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional().nullable(),
});

export const adjustmentRequestSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  direction: adjustmentDirectionSchema,
  notes: z.string().optional().nullable(),
});

export const returnRequestSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional().nullable(),
});

export const stockMovementFormSchema = z
  .object({
    movementType: stockMovementTypeSchema,
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    direction: adjustmentDirectionSchema.optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.movementType === "ADJUSTMENT" && !value.direction) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Direction is required",
        path: ["direction"],
      });
    }
  });

export const productVariantResponseSchema = z.object({
  ...baseResponseDataSchema.shape,
  ...productVariantSchema.omit({ image: true }).shape,
  productId: z.number(),
  productName: z.string(),
  stockQuantity: z.number(),
  active: z.boolean(),
  image: z.string(),
});

export const editProductVariantSchema = z.object({
  id: z.number(),
  price: z.number().positive(),
  size: z.string().optional().nullable(),
  flavor: z.string().optional().nullable(),
  packaging: z.string().optional().nullable(),
});

export type Product = z.infer<typeof productResponseSchema>;
export type CreateProduct = z.infer<typeof productSchema>;
export type PaginatedProduct = Paginated<Product>;

export type ProductVariant = z.infer<typeof productVariantResponseSchema>;
export type EditProductVariant = z.infer<typeof editProductVariantSchema>;
export type CreateProductVariant = z.infer<typeof productVariantSchema>;
export type PaginatedProductVariant = Paginated<ProductVariant>;
export type StockMovementType = z.infer<typeof stockMovementTypeSchema>;
export type AdjustmentDirection = z.infer<typeof adjustmentDirectionSchema>;
export type RestockRequest = z.infer<typeof restockRequestSchema>;
export type AdjustmentRequest = z.infer<typeof adjustmentRequestSchema>;
export type ReturnRequest = z.infer<typeof returnRequestSchema>;
export type StockMovementFormValues = z.infer<typeof stockMovementFormSchema>;
