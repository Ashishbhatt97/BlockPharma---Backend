import { Response } from "express";
import sendResponse from "../helper/responseHelper";
import asyncHandler from "../middleware/asyncHandler";
import { CustomRequest } from "../middleware/jwtAuthentication";
import {
  VendorOrganizationSchema,
  VendorOrganizationSchemaType,
} from "../models/Vendor";
import { vendorServices } from "../services/services";

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

// @desc    Add Organization
// @route   /api/vendor/addOrganization
// @access  POST
const addOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const { id } = req.user;

    const validateOrganization = VendorOrganizationSchema.safeParse(req.body);

    if (validateOrganization.error) {
      return sendResponse(res, 400, {
        message: validateOrganization.error.message,
      });
    }

    const validatedSchema: VendorOrganizationSchemaType =
      validateOrganization.data;

    const result = await vendorServices.addOrganizationService(
      id,
      validatedSchema
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Get Organization
// @route   /api/vendor/getOrganization
// @access  GET
const getOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const result = await vendorServices.getOrganizationService(Number(orgId));

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Delete Organization
// @route   /api/vendor/deleteOrganization
// @access  DELETE
const deleteOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const result = await vendorServices.deleteOrganizationService(
      Number(orgId)
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

export default {
  addVendor,
  deleteVendor,
  getVendor,
  addOrganization,
  getOrganization,
  deleteOrganization,
};
