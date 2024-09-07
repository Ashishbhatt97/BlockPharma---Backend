import { OrderSchemaType, UpdateOrderSchemaType } from "../models/Orders";
import { orderDataAccess } from "../data access/dataAccess";

const createOrderService = async (
  id: string,
  validatedOrder: OrderSchemaType
) => {
  const order = await orderDataAccess.createOrder(id, validatedOrder);

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

const getOrderByIdService = async (orderId: string) => {
  const order = await orderDataAccess.getOrderById(orderId);

  if (!order || order.status !== 200) {
    return {
      status: order?.status,
      message: order?.message,
    };
  }

  return {
    status: order.status,
    message: order.message,
    data: order.data,
  };
};

const updateOrderService = async (
  orderId: string,
  orderDetails: UpdateOrderSchemaType
) => {
  const updatedOrder = await orderDataAccess.updateOrder(orderId, orderDetails);

  if (!updatedOrder || updatedOrder.status !== 200) {
    return {
      status: updatedOrder?.status,
      message: updatedOrder?.message,
    };
  }

  return {
    status: updatedOrder.status,
    message: updatedOrder.message,
    data: updatedOrder.data,
  };
};

const cancelOrderService = async (orderId: string, userId: string) => {
  const cancelledOrder = await orderDataAccess.cancelOrder(orderId, userId);

  if (!cancelledOrder || cancelledOrder.status !== 200) {
    return {
      status: cancelledOrder?.status,
      message: cancelledOrder?.message,
    };
  }

  return {
    status: cancelledOrder.status,
    message: cancelledOrder.message,
    data: cancelledOrder.data,
  };
};

export default {
  createOrderService,
  getAllPharmacistOrdersService,
  getOrderByIdService,
  updateOrderService,
  cancelOrderService,
};
