import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import sendResponse from "../helper/responseHelper";
import { vendorServices } from "../services/services";
import { CustomRequest } from "../middleware/jwtAuthentication";

// @desc    Add Vendor
// @route   /api/vendor/addVendor
// @access  POST
const addVendor = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;
  const { vendorDetails } = req.body;

  const result = await vendorServices.addVendorService(id, vendorDetails);

  if (result && result.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

export default {
  addVendor,
};
