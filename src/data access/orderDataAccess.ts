import { orderStatus, paymentMethod, paymentStatus } from "@prisma/client";
import prisma from "../config/db.config";
import { OrderSchemaType } from "../models/Orders";

const createOrder = async (validatedOrder: OrderSchemaType) => {
  // Check for undefined or missing orderStatus
  if (validatedOrder.orderStatus === undefined) {
    return {
      status: 400,
      message: "Order status is required",
    };
  }

  // Check for undefined or missing paymentStatus
  if (validatedOrder.paymentStatus === undefined) {
    return {
      status: 400,
      message: "Payment status is required",
    };
  }

  // Check for undefined or missing paymentMethod
  if (!validatedOrder.paymentMethod) {
    return {
      status: 400,
      message: "Payment method is required",
    };
  }

  const order = await prisma.orders.create({
    data: {
      orderId: validatedOrder.orderId,
      userId: validatedOrder.userId,
      pharmacyOutletId: validatedOrder.pharmacyOutletId,
      orgId: validatedOrder.orgId,
      orderDate: validatedOrder.orderDate,
      orderDetails: validatedOrder.orderDetails,
      amount: validatedOrder.amount,
      currency: validatedOrder.currency,
      paymentMethod: validatedOrder.paymentMethod as paymentMethod,
      orderStatus: validatedOrder.orderStatus as orderStatus,
      paymentStatus: validatedOrder.paymentStatus as paymentStatus,
    },
  });
  return order;
};

export default { createOrder };
