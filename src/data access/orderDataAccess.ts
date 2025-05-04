import prisma from "../config/db.config";
import { OrderStatus } from "@prisma/client";

const createOrder = async (orderData: any) => {
  return await prisma.$transaction(async (prisma) => {
    const order = await prisma.order.create({
      data: {
        paymentMethod: orderData.paymentMethod,
        amount: orderData.amount || 0,
        blockchainTxHash: orderData.blockchainTxHash,
        orderDate: new Date(),
        user: { connect: { id: orderData.userId } },
        pharmacyOutlet: { connect: { id: orderData.pharmacyOutletId } },
        vendorOrg: { connect: { id: orderData.vendorOrgId } },
        orderItems: {
          create: orderData.orderItems.map((item: any) => ({
            product: { connect: { id: item.productId } },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    await Promise.all(
      orderData.orderItems.map((item: any) =>
        prisma.inventoryItem.updateMany({
          where: {
            productId: item.productId,
            pharmacyOutletId: orderData.pharmacyOutletId,
          },
          data: {
            stock: { decrement: item.quantity },
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

const getAllOrderForPharmacist = async (pharmacistUserId?: string) => {
  return await prisma.order.findMany({
    where: {
      pharmacyOutlet: {
        ownerId: pharmacistUserId,
      },
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

const createBlockchainRecord = async (data: {
  txHash: string;
  orderId?: string;
  action: string;
}) => {
  const res = await prisma.blockchainRecord.create({
    data: {
      txHash: data.txHash,
      orderId: data.orderId,
      action: data.action,
      timestamp: new Date(),
    },
  });
  console.log(res);
  return res;
};

const updateBlockchainRecord = async (data: {
  txHash: string;
  orderId?: string;
  action: string;
}) => {
  return await prisma.blockchainRecord.update({
    where: {
      txHash: data.txHash,
    },
    data: {
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
  updateBlockchainRecord,
  getAllOrderForPharmacist,
};
