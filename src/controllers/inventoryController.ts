import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import sendResponse from "../helper/responseHelper";
import { inventoryServices } from "../services/inventoryService";
import { CustomRequest } from "../middleware/jwtAuthentication";

const addInventory = asyncHandler(async (req: CustomRequest, res: Response) => {
  const result = await inventoryServices.addToInventoryService(req.body);
  sendResponse(res, result.status, result);
});

const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const { pharmacyOutletId } = req.params;

  const result = await inventoryServices.getInventoryByPharmacy(
    pharmacyOutletId
  );
  sendResponse(res, result.status, result);
});

const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await inventoryServices.updateInventoryItem(id, req.body);
  sendResponse(res, result.status, result);
});

const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await inventoryServices.deleteInventoryItem(id);
  sendResponse(res, result.status, result);
});

export default {
  addInventory,
  getInventory,
  updateInventory,
  deleteInventory,
};
