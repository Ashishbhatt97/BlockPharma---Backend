import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import sendResponse from "../helper/responseHelper";
import { vendorServices } from "../services/services";
import { CustomRequest } from "../middleware/jwtAuthentication";
import { VendorOwnerSchema, VendorSchemaType } from "../models/Vendor";

// @desc    Add Vendor
// @route   /api/vendor/addVendor
// @access  POST
const addVendor = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const result = await vendorServices.addVendorService(id);

  if (result && result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Get Vendor
// @route   /api/vendor/getVendor
// @access  GET
const getVendor = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const result = await vendorServices.getVendorService(id);

  if (result && result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Delete Vendor
// @route   /api/vendor/deleteVendor
// @access  DELETE
const deleteVendor = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const result = await vendorServices.deleteVendorService(id);

  if (result && result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

export default {
  addVendor,
  deleteVendor,
  getVendor,
};
