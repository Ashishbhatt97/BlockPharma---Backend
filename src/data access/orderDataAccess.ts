import { orderStatus, paymentMethod, paymentStatus } from "@prisma/client";
import prisma from "../config/db.config";
import { OrderSchemaType } from "../models/Orders";
import pharmacistDataAccess from "./pharmacistDataAccess";

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

  try {
    const isPharmacist = await pharmacistDataAccess.isUserPharmacist(
      validatedOrder.userId
    );
    if (!isPharmacist) {
      return {
        status: 403,
        message: "User is not a pharmacist",
      };
    }

    const order = await prisma.orders.create({
      data: {
        orderId: `ORD-${
          validatedOrder.userId.trim().substring(0, 3) +
          Math.floor(Math.random() * 1000000)
        }`,
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

    if (!order) {
      return {
        status: 400,
        message: "Order creation failed",
      };
    }

    return {
      status: 201,
      message: "Order created successfully",
      data: order,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

const getAllPharmacistOrders = async (userId: string) => {
  try {
    const isPharmacist = await pharmacistDataAccess.isUserPharmacist(userId);
    if (!isPharmacist) {
      return {
        status: 403,
        message: "User is not a pharmacist",
      };
    }

    const orders = await prisma.orders.findMany({
      where: {
        userId,
      },
    });

    if (!orders) {
      return {
        status: 404,
        message: "Orders not found",
      };
    }

    return {
      status: 200,
      message: "Orders fetched successfully",
      data: orders,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};
export default { createOrder, getAllPharmacistOrders };
