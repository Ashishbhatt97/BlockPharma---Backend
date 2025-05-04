import prisma from "../config/db.config";
import { OrderStatus } from "@prisma/client";

const createOrder = async (orderData: any) => {
  return await prisma.$transaction(async (prisma) => {
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        pharmacyOutletId: orderData.pharmacyOutletId,
        vendorOrgId: orderData.vendorOrgId,
        paymentMethod: orderData.paymentMethod,
        amount: orderData.amount || 0,
        blockchainTxHash: orderData.blockchainTxHash,
        orderDate: new Date(), // Add orderDate
        user: {
          connect: { id: orderData.userId }, // Connect user relation
        },
        pharmacyOutlet: {
          connect: { id: orderData.pharmacyOutletId }, // Connect pharmacyOutlet relation
        },
        vendorOrg: {
          connect: { id: orderData.vendorOrgId }, // Connect vendorOrg relation
        },
        orderItems: {
          create: orderData.orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 2. Update inventory (optional)
    await Promise.all(
      orderData.orderItems.map((item: any) =>
        prisma.inventoryItem.updateMany({
          where: {
            productId: item.productId,
            pharmacyOutletId: orderData.pharmacyOutletId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    return order;
  });
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  blockchainTxHash?: string
) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: status,
      ...(blockchainTxHash && { blockchainTxHash }),
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      pharmacyOutlet: true,
      vendorOrg: true,
    },
  });
};

const getOrderForVendor = async (orderId: string, vendorUserId?: string) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      vendorOrg: {
        ownerId: vendorUserId,
      },
    },
  });
};

const createBlockchainRecord = async (data: {
  txHash: string;
  orderId?: string;
  action: string;
}) => {
  return await prisma.blockchainRecord.create({
    data: {
      txHash: data.txHash,
      orderId: data.orderId,
      action: data.action,
      timestamp: new Date(),
    },
  });
};

export default {
  createOrder,
  updateOrderStatus,
  getOrderForVendor,
  createBlockchainRecord,
};
