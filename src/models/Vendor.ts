import { z } from "zod";

export const VendorOrganizationSchema = z.object({
  orgId: z.string().uuid().optional(),
  ownerId: z.string(),
  userId: z
    .string()
    .uuid({ message: "Invalid user ID format. Must be a UUID." })
    .optional(),
  businessName: z
    .string()
    .min(1, { message: "Business name cannot be empty." })
    .max(100, { message: "Business name must be 100 characters or less." }),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/, {
      message: "Invalid GSTIN format.",
    }),
  email: z.string().email({ message: "Invalid email format." }),
  street: z
    .string()
    .min(1, { message: "Street address cannot be empty." })
    .max(255, { message: "Street address must be 255 characters or less." }),
  city: z
    .string()
    .min(1, { message: "City cannot be empty." })
    .max(100, { message: "City name must be 100 characters or less." }),
  state: z
    .string()
    .min(1, { message: "State cannot be empty." })
    .max(100, { message: "State name must be 100 characters or less." }),
  pincode: z.string().regex(/^\d{6}$/, {
    message: "Invalid pincode format. Must be a 6-digit number.",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number format." }),
  website: z.string().url({ message: "Invalid website URL." }).optional(),
  isActive: z.boolean().optional(),
});

export type VendorOrganizationSchemaType = z.infer<
  typeof VendorOrganizationSchema
>;
