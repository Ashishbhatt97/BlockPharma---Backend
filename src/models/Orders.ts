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

const paymentMethodEnum = z.enum(["CARD", "NET_BANKING", "UPI", "CASH"], {
  errorMap: () => ({
    message:
      "Invalid payment method. Must be one of CARD, NET_BANKING, UPI, or CASH_ON_DELIVERY.",
  }),
});

// Zod validation schema for the order model
export const orderValidationSchema = z.object({
  orderId: z.string().optional(),
  userId: z
    .string({
      required_error: "User ID is required.",
      invalid_type_error: "User ID must be a string.",
    })
    .optional(),
  pharmacyOutletId: z.bigint({
    required_error: "Pharmacy Outlet ID is required.",
    invalid_type_error: "Pharmacy Outlet ID must be a BigInt.",
  }),
  orgId: z.bigint({
    required_error: "Organization ID is required.",
    invalid_type_error: "Organization ID must be a BigInt.",
  }),
  orderDate: z
    .date({
      required_error: "Order date is required.",
      invalid_type_error: "Order date must be a valid date.",
    })
    .optional(),
  orderStatus: orderStatusEnum.default("PENDING"),
  paymentStatus: paymentStatusEnum.default("PENDING"),
  paymentMethod: paymentMethodEnum,
  amount: z.number().positive({ message: "Amount must be a positive number." }),
  currency: z
    .string()
    .min(1, { message: "Currency is required and cannot be empty." }),
  orderItems: z
    .any({
      required_error: "Order details must be a valid JSON object.",
    })
    .optional(),
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

const orderItemValidationSchema = z.array(
  z.object({
    orderId: z.string({
      required_error: "Order ID is required.",
      invalid_type_error: "Order ID must be a string.",
    }),
    productId: z.string({
      required_error: "Product ID is required.",
      invalid_type_error: "Product ID must be a string.",
    }),
    quantity: z
      .number()
      .int()
      .positive({ message: "Quantity must be a positive integer." }),
    price: z.number().positive({ message: "Price must be a positive number." }),
    createdAt: z
      .date()
      .optional()
      .default(new Date())
      .or(
        z.string().datetime({ message: "Invalid date format for createdAt." })
      ),
    updatedAt: z
      .date()
      .optional()
      .or(
        z.string().datetime({ message: "Invalid date format for updatedAt." })
      ),
  })
);

export type OrderItemSchemaType = z.infer<typeof orderItemValidationSchema>;
export type OrderSchemaType = z.infer<typeof orderValidationSchema>;
