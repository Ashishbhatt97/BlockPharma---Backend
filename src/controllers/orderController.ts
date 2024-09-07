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

  const validate = orderValidationSchema.safeParse(req.body);

  if (!validate.success) {
    return sendResponse(res, 400, {
      status: false,
      message: validate.error.errors[0].message,
    });
  }

  const validatedOrder: OrderSchemaType = validate.data;

  const result = await orderServices.createOrderService(validatedOrder);
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

export default {
  createOrder,
  getOrders,
};
