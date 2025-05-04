import {
  orderDataAccess,
  pharmacistDataAccess,
} from "../data access/dataAccess";
import { OrderStatus } from "@prisma/client";

const createOrder = async (orderData: any) => {
  try {
    const pharmacyOutlet = await pharmacistDataAccess.isOwnerOfPharmacy(
      orderData.pharmacyOutletId,
      orderData.userId
    );

    if (!pharmacyOutlet) {
      return {
        status: 403,
        error: "You don't own this pharmacy outlet",
      };
    }

    // Verify all products belong to the vendor
    // const validProducts = await orderDataAccess.verifyProducts(
    //   orderData.orderItems,
    //   orderData.vendorOrgId
    // );

    // if (!validProducts) {
    //   return {
    //     status: 400,
    //     error: "One or more products don't belong to this vendor",
    //   };
    // }

    // Create blockchain transaction record
    if (orderData.blockchainTxHash) {
      await orderDataAccess.createBlockchainRecord({
        txHash: orderData.blockchainTxHash,
        orderId: "", // Will be updated after order creation
        action: "ORDER_CREATED",
      });
    }

    const order = await orderDataAccess.createOrder(orderData);

    // Update blockchain record with order ID if created
    // if (orderData.blockchainTxHash && order.data?.id) {
    //   await orderDataAccess.updateBlockchainRecord(orderData.blockchainTxHash, {
    //     orderId: order.data.id,
    //   });
    // }

    return {
      status: 201,
      data: order,
      message: "Order created successfully",
    };
  } catch (error: any) {
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

export default {
  createOrder,
  // getPharmacyOrders,
  // getVendorPendingOrders,
  updateOrderStatus,
  // getOrderDetails,
};
