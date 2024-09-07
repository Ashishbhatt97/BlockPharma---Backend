import prisma from "../config/db.config";
import pharmacistDataAccess from "./pharmacistDataAccess";
import convertBigIntToString from "../helper/convertBigIntToString";
import { OrderSchemaType, UpdateOrderSchemaType } from "../models/Orders";
import { orderStatus, paymentMethod, paymentStatus } from "@prisma/client";

type OrderItemSchemaType = {
  productId: string;
  quantity: number;
  price: number;
};
//create order
const createOrder = async (id: string, validatedOrder: OrderSchemaType) => {
  try {
    const isPharmacist = await pharmacistDataAccess.isUserPharmacist(id);
    if (!isPharmacist) {
      return {
        status: 403,
        message: "User is not a pharmacist",
      };
    }

    const order = await prisma.orders.create({
      data: {
        orderId: `ORD-${
          id.trim().substring(0, 3) + Math.floor(Math.random() * 1000000)
        }`,
        userId: id,
        pharmacyOutletId: validatedOrder.pharmacyOutletId,
        orgId: validatedOrder.orgId,
        orderDate: new Date(),
        amount: validatedOrder.amount,
        currency: validatedOrder.currency,
        paymentMethod: validatedOrder.paymentMethod as paymentMethod,
        orderStatus: validatedOrder.orderStatus as orderStatus,
        paymentStatus: validatedOrder.paymentStatus as paymentStatus,
      },
    });

    console.log(order);

    const orderItems = await createOrderItem(
      order.orderId,
      validatedOrder.orderItems
    );

    console.log(orderItems);

    if (!order || !orderItems) {
      return {
        status: 400,
        message: "Order creation failed",
      };
    }

    const orderData = convertBigIntToString(order);

    return {
      status: 201,
      message: "Order created successfully",
      data: orderData,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

//get all orders for a pharmacist
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

//create order item
const createOrderItem = async (
  orderId: string,
  orderItems: OrderItemSchemaType[]
) => {
  console.log(orderItems);
  try {
    const orderItem = await prisma.orderItems.createMany({
      data: orderItems.map((item) => ({
        orderId,
        productId: BigInt(item.productId),
        quantity: item.quantity,
        price: item.price,
      })),
    });

    if (!orderItem || orderItem.count === 0) {
      return null;
    }

    return orderItem;
  } catch (error: any) {
    return null;
  }
};

//get order by id
const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        orderId,
      },
    });

    if (!order) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const orderData = convertBigIntToString(order);

    const orderItems = await prisma.orderItems.findMany({
      where: {
        orderId,
      },
    });

    const orderItemsData = convertBigIntToString(orderItems);

    return {
      status: 200,
      message: "Order fetched successfully",
      data: {
        ...orderData,
        orderItems: orderItemsData,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

//update order
const updateOrder = async (orderId: string, order: UpdateOrderSchemaType) => {
  try {
    const updatedOrder = await prisma.orders.update({
      where: {
        orderId,
      },
      data: {
        orderStatus: order.orderStatus as orderStatus,
        paymentStatus: order.paymentStatus as paymentStatus,
      },
    });

    if (!updatedOrder) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const updatedOrderData = convertBigIntToString(updatedOrder);
    return {
      status: 200,
      message: "Order updated successfully",
      data: updatedOrderData,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

//cancel order
const cancelOrder = async (orderId: string, userId: string) => {
  try {
    const isPharmacist = await pharmacistDataAccess.isUserPharmacist(userId);

    if (!isPharmacist) {
      return {
        status: 403,
        message: "User is not a pharmacist",
      };
    }

    const cancelledOrder = await prisma.orders.update({
      where: {
        orderId,
      },
      data: {
        orderStatus: "CANCELLED" as orderStatus,
        paymentStatus: "FAILED" as paymentStatus,
      },
    });

    if (!cancelledOrder) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const cancelledOrderData = convertBigIntToString(cancelledOrder);

    return {
      status: 200,
      message: "Order cancelled successfully",
      data: cancelledOrderData,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export default {
  createOrder,
  getAllPharmacistOrders,
  createOrderItem,
  getOrderById,
  updateOrder,
  cancelOrder,
};
