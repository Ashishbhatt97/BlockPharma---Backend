import { Response } from "express";
import sendResponse from "../helper/responseHelper";
import asyncHandler from "../middleware/asyncHandler";
import { CustomRequest } from "../middleware/jwtAuthentication";
import { OrderSchemaType, orderValidationSchema } from "../models/Orders";
import { orderServices } from "../services/services";

// @desc    Create Order
// @route   POST /api/orders/createOrder
// @MET  POST
const createOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, {
      status: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.user;
  const orderSchema = {
    pharmacyOutletId: BigInt(req.body.pharmacyOutletId),
    orgId: BigInt(req.body.orgId),
    orderDate: new Date(),
    orderStatus: req.body.orderStatus,
    paymentStatus: req.body.paymentStatus,
    orderItems: req.body.orderItems,
    currency: req.body.currency,
    paymentMethod: req.body.paymentMethod,
    amount: req.body.amount,
    orderDetails: req.body.orderDetails,
  };

  const validate = orderValidationSchema.safeParse(orderSchema);

  if (!validate.success) {
    console.log(validate.error.errors[0]);
    return sendResponse(res, 400, {
      status: false,
      message: validate.error.errors[0].message,
    });
  }

  const validatedOrder: OrderSchemaType = validate.data;

  const result = await orderServices.createOrderService(id, validatedOrder);
  if (result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Get Orders
// @route   /api/orders/getOrders
// @access  POST
const getOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, {
      status: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.user;

  const result = await orderServices.getAllPharmacistOrdersService(id);
  if (result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Get Order By Id
// @route   /api/orders/getOrderById
// @access  GET
const getOrderById = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, {
      status: false,
      message: "Unauthorized",
    });
  }

  const { orderId } = req.body;

  const result = await orderServices.getOrderByIdService(orderId);

  if (result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Update Order
// @route   /api/orders/updateOrder
// @access  PUT
const updateOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, {
      status: false,
      message: "Unauthorized",
    });
  }

  const { orderId } = req.body;
  const orderDetails = req.body;

  const result = await orderServices.updateOrderService(orderId, orderDetails);
  if (result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Cancel Order
// @route   /api/orders/cancelOrder
// @access  PUT
const cancelOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, {
      status: false,
      message: "Unauthorized",
    });
  }

  const { id } = req.user;
  const { orderId } = req.body;

  const result = await orderServices.cancelOrderService(orderId, id);
  if (result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
};
