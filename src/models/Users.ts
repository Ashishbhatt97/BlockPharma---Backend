import { z } from "zod";

// Role Enum
const Role = z.enum(["USER", "ADMIN", "SUPPLIER", "PHARMACY"]); // Adjust according to your roles

// Signup Schema
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  profilePic: z.string().optional(),
  oAuthId: z.string().optional(),
  provider: z.string().optional(),
  role: Role.optional(), // Default will be handled by your ORM
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  isDeleted: z.boolean().optional(),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Update Schema
export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  profilePic: z.string().optional(),
  role: Role.optional(), // Default will be handled by your ORM
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  isDeleted: z.boolean().optional(),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof signupSchema>;
export type updateUserSchemaType = z.infer<typeof updateUserSchema>;
