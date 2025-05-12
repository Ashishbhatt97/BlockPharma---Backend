import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import sendResponse from "../helper/responseHelper";
import { orderServices } from "../services/services";
import { CustomRequest } from "../middleware/jwtAuthentication";

const createOrder = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { error: "Unauthorized" });
  }

  const result = await orderServices.createOrder({
    ...req.body,
    userId: req.user.id,
    pharmacyOutletId: req.body.pharmacyOutletId,
    blockchainTxHash: req.body.blockchainTxHash,
    blockchainOrderId: req.body.blockchainOrderId,
  });

  sendResponse(res, result.status, result);
});

const getPharmacyOrders = asyncHandler(async (req: Request, res: Response) => {
  const { pharmacyOutletId } = req.params;
  // const result = await orderServices.getPharmacyOrders(pharmacyOutletId);
  // sendResponse(res, result.status, result);
});

const getVendorPendingOrders = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { error: "Unauthorized" });
    }

    // const result = await orderServices.getVendorPendingOrders(req.user.id);
    // sendResponse(res, result.status, result);
  }
);

const updateOrderStatus = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { orderStatus: status, blockchainTxHash } = req.body;

    const result = await orderServices.updateOrderStatus(
      id,
      status,
      req.user?.id,
      blockchainTxHash
    );

    sendResponse(res, result.status, result);
  }
);

const getOrderDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // const result = await orderServices.getOrderDetails(id);
  // sendResponse(res, result.status, result);
});

const getAllPharmacyOrders = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { error: "Unauthorized" });
    }
    const { id } = req.user;

    const result = await orderServices.getAllOrderForPharmacistService(id);
    sendResponse(res, result.status, result);
  }
);

const getAllSupplierOrders = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { error: "Unauthorized" });
    }
    const { id } = req.user;

    const result = await orderServices.getAllOrderForSupplierService(id);
    sendResponse(res, result.status, result);
  }
);

export default {
  createOrder,
  getPharmacyOrders,
  getVendorPendingOrders,
  updateOrderStatus,
  getOrderDetails,
  getAllPharmacyOrders,
  getAllSupplierOrders,
};
