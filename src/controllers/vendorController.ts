import { Response } from "express";
import sendResponse from "../helper/responseHelper";
import asyncHandler from "../middleware/asyncHandler";
import { CustomRequest } from "../middleware/jwtAuthentication";
import {
  VendorOrganizationSchema,
  VendorOrganizationSchemaType,
} from "../models/Vendor";
import { vendorServices } from "../services/services";

// @desc    Get User's Vendor Organizations
// @route   /api/vendor/organizations
// @access  GET
const getVendorOrganizations = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const { id } = req.user;
    const result = await vendorServices.getVendorOrganizationsService(id);

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Add Vendor Organization
// @route   /api/vendor/organization
// @access  POST
const addVendorOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const { ownerId: id } = req.body;
    const validateOrganization = VendorOrganizationSchema.safeParse(req.body);

    if (validateOrganization.error) {
      return sendResponse(res, 400, {
        message: validateOrganization.error.message,
      });
    }

    const validatedSchema: VendorOrganizationSchemaType =
      validateOrganization.data;

    const result = await vendorServices.addVendorOrganizationService(
      id,
      validatedSchema
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Get Specific Organization
// @route   /api/vendor/organization/:id
// @access  GET
const getOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.params.id || req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const result = await vendorServices.getOrganizationService(orgId as string);

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Update Organization
// @route   /api/vendor/organization/:id
// @access  PUT
const updateOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.params.id || req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const validateOrganization = VendorOrganizationSchema.partial().safeParse(
      req.body
    );

    if (validateOrganization.error) {
      return sendResponse(res, 400, {
        message: validateOrganization.error.message,
      });
    }

    const validatedSchema = validateOrganization.data;

    const result = await vendorServices.updateOrganizationService(
      orgId as string,
      validatedSchema
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Delete Organization
// @route   /api/vendor/organization/:id
// @access  DELETE
const deleteOrganization = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.params.id || req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const result = await vendorServices.deleteOrganizationService(
      orgId as string
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Get All Vendor Organizations
// @route   /api/vendor/organizations/all
// @access  GET
const getAllVendorOrganizations = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const result = await vendorServices.getAllVendorOrganizationsService();

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Toggle Organization Status
// @route   /api/vendor/organization/:id/toggle
// @access  PUT
const toggleOrganizationStatus = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const orgId = req.params.id || req.query.orgId;

    if (!orgId) {
      return sendResponse(res, 400, { message: "Organization ID is required" });
    }

    const result = await vendorServices.toggleOrganizationStatusService(
      orgId as string
    );

    if (result && result.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

export default {
  getVendorOrganizations,
  addVendorOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getAllVendorOrganizations,
  toggleOrganizationStatus,
};
