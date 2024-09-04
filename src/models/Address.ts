import { z } from "zod";

const AddressSchema = z.object({
  id: z.string().uuid().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z
    .string()
    .min(1, "Zip code is required")
    .max(10, "Zip code cannot exceed 10 characters"),
  userId: z.string().uuid().optional(),
});

export type AddressSchemaType = z.infer<typeof AddressSchema>;

export default AddressSchema;
