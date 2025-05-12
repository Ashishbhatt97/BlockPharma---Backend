import { OrderStatus } from "@prisma/client";
import { orderDataAccess } from "../data access/dataAccess";

const createOrder = async (orderData: any) => {
  try {
    const order = await orderDataAccess.createOrder(orderData);

    if (orderData.blockchainTxHash && order.id) {
      await orderDataAccess.createBlockchainRecord({
        txHash: orderData.blockchainTxHash,
        orderId: order.id,
        action: "ORDER_CREATED",
      });
    }

    return {
      status: 201,
      data: order,
      message: "Order created successfully",
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return {
      status: 400,
      error: error.message || "Error creating order",
    };
  }
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  userId?: string,
  blockchainTxHash?: string
) => {
  try {
    // Verify order belongs to vendor
    const order = await orderDataAccess.getOrderForVendor(orderId, userId);
    if (!order) {
      return {
        status: 403,
        error: "You don't have permission to update this order",
      };
    }

    // Validate status transition
    // const validTransition = await orderDataAccess.validateStatusTransition(
    //   order.orderStatus,
    //   status
    // );

    // if (!validTransition) {
    //   return {
    //     status: 400,
    //     error: "Invalid status transition",
    //   };
    // }

    // Create blockchain record for status update
    if (blockchainTxHash) {
      await orderDataAccess.createBlockchainRecord({
        txHash: blockchainTxHash,
        orderId,
        action: `STATUS_${status}`,
      });
    }

    const updatedOrder = await orderDataAccess.updateOrderStatus(
      orderId,
      status,
      blockchainTxHash
    );

    return {
      status: 200,
      data: updatedOrder,
      message: "Order status updated successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error updating order status",
    };
  }
};

const getAllOrderForPharmacistService = async (pharmacistUserId: string) => {
  try {
    const orders = await orderDataAccess.getAllOrderForPharmacist(
      pharmacistUserId
    );
    return {
      status: 200,
      data: orders,
      message: "Orders fetched successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error fetching orders",
    };
  }
};

const getAllOrderForSupplierService = async (supplierUserId: string) => {
  try {
    const orders = await orderDataAccess.getAllOrderForSupplier(supplierUserId);
    return {
      status: 200,
      data: orders,
      message: "Orders fetched successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error fetching orders",
    };
  }
};

export default {
  createOrder,
  updateOrderStatus,
  getAllOrderForPharmacistService,
  getAllOrderForSupplierService,
};
