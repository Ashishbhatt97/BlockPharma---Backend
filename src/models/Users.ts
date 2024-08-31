import { z } from "zod";

// Role Enum
const Role = z.enum(["USER", "ADMIN", "SUPPLIER", "PHARMACY"]); // Adjust according to your roles

// Signup Schema
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
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

export type loginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof signupSchema>;
