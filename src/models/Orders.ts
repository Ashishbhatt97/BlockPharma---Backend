import { z } from "zod";

// Enums for orderStatus, paymentStatus, and paymentMethod
const orderStatusEnum = z.enum(
  ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"],
  {
    errorMap: () => ({
      message:
        "Invalid order status. Must be one of PENDING, PROCESSING, COMPLETED, or CANCELLED.",
    }),
  }
);

const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED"], {
  errorMap: () => ({
    message: "Invalid payment status. Must be one of PENDING, PAID, or FAILED.",
  }),
});

const paymentMethodEnum = z.enum(
  ["CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "UPI", "CASH_ON_DELIVERY"],
  {
    errorMap: () => ({
      message:
        "Invalid payment method. Must be one of CREDIT_CARD, DEBIT_CARD, NET_BANKING, UPI, or CASH_ON_DELIVERY.",
    }),
  }
);

// Zod validation schema for the order model
export const orderValidationSchema = z.object({
  orderId: z
    .string()
    .uuid({ message: "Invalid order ID. Must be a valid UUID." }),
  userId: z.string({
    required_error: "User ID is required.",
    invalid_type_error: "User ID must be a string.",
  }),
  pharmacyOutletId: z.bigint({
    required_error: "Pharmacy Outlet ID is required.",
    invalid_type_error: "Pharmacy Outlet ID must be a BigInt.",
  }),
  orgId: z.bigint({
    required_error: "Organization ID is required.",
    invalid_type_error: "Organization ID must be a BigInt.",
  }),
  orderDate: z.date({
    required_error: "Order date is required.",
    invalid_type_error: "Order date must be a valid date.",
  }),
  orderStatus: orderStatusEnum.default("PENDING"),
  paymentStatus: paymentStatusEnum.default("PENDING"),
  paymentMethod: paymentMethodEnum,
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  currency: z
    .string()
    .min(1, { message: "Currency is required and cannot be empty." }),
  orderDetails: z.any({
    required_error: "Order details must be a valid JSON object.",
  }),
  createdAt: z
    .date()
    .optional()
    .default(new Date())
    .or(z.string().datetime({ message: "Invalid date format for createdAt." })),
  updatedAt: z
    .date()
    .optional()
    .or(z.string().datetime({ message: "Invalid date format for updatedAt." })),
});

export type OrderSchemaType = z.infer<typeof orderValidationSchema>;
