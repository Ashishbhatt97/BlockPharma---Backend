import { OrderSchemaType } from "../models/Orders";

import { orderDataAccess } from "../data access/dataAccess";

const createOrderService = async (validatedOrder: OrderSchemaType) => {
  const order = await orderDataAccess.createOrder(validatedOrder);

  if (!order || order.status !== 201) {
    return {
      status: order.status,
      message: order.message,
    };
  }

  return {
    status: order.status,
    message: order.message,
    data: order.data,
  };
};

const getAllPharmacistOrdersService = async (userId: string) => {
  const orders = await orderDataAccess.getAllPharmacistOrders(userId);

  if (!orders || orders.status !== 200) {
    return {
      status: orders.status,
      message: orders.message,
    };
  }

  return {
    status: orders.status,
    message: orders.message,
    data: orders.data,
  };
};

export default { createOrderService, getAllPharmacistOrdersService };
