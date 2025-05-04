import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Invalid URL").optional(),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().positive("Price must be positive"),
  vendorOrgId: z.string().uuid("Invalid vendor organization ID"),
});

export const BulkProductSchema = z.array(ProductSchema);

export type ProductInput = z.infer<typeof ProductSchema>;
export type BulkProductInput = z.infer<typeof BulkProductSchema>;
export type Product = {
  id: string;
} & ProductInput;
