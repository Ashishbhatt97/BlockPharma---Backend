import { Response } from "express";
import sendResponse from "../helper/responseHelper";
import asyncHandler from "../middleware/asyncHandler";
import { CustomRequest } from "../middleware/jwtAuthentication";

import { pharmacistServices } from "../services/services";
import {
  pharmacyOutletSchema,
  PharmacyOutletType,
  updatePharmacyOutletSchema,
  UpdatePharmacyOutletType,
} from "../models/Pharmacy";

// @desc    Add Pharmacist
// @route   /api/pharmacist/add
// @access  POST
const addPharmacist = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.user;
    const result = await pharmacistServices.addPharmacistService(id);

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Get All Pharmacists
// @route   /api/pharmacist/getall
// @access  GET
const getAllPharmacists = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const result = await pharmacistServices.getAllPharmacistsService();

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Delete Pharmacist
// @route   /api/pharmacist/delete
// @access  DELETE

const deletePharmacist = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.user;
    const result = await pharmacistServices.deletePharmacistService(id);

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Get Pharmacist By Id
// @route   /api/pharmacist/get
// @access  GET
const getPharmacistById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.user;
    const result = await pharmacistServices.getPharmacistByIdService(id);

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Add Pharmacy Outlet
// @route   /api/pharmacist/outlet/add
// @access  POST
const addPharmacyOutlet = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.user;
    const validatedPharmacySchema = pharmacyOutletSchema.safeParse(req.body);

    if (validatedPharmacySchema.error) {
      return sendResponse(res, 400, {
        message: validatedPharmacySchema.error.message,
      });
    }

    const validatedSchema: PharmacyOutletType = validatedPharmacySchema.data;

    const result = await pharmacistServices.addPharmacyOutletService(
      id,
      validatedSchema
    );

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Get Pharmacy Outlet By Id
// @route   /api/pharmacist/outlet/get
// @access  GET
const getPharmacyOutletById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }
    const pharmacyOutletId = req.query.pharmacyOutletId;

    const result = await pharmacistServices.getPharmacyOutletByIdService(
      Number(pharmacyOutletId)
    );

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Delete Pharmacy Outlet
// @route   /api/pharmacist/outlet/delete
// @access  DELETE
const deletePharmacyOutlet = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const pharmacyOutletId = req.query.pharmacyOutletId;

    const result = await pharmacistServices.deletePharmacyOutletService(
      Number(pharmacyOutletId)
    );

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Get All Pharmacy Outlets
// @route   /api/pharmacist/outlet/getall
// @access  GET
const getAllPharmacyOutlets = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const result = await pharmacistServices.getAllPharmacyOutletsService();

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

// @desc    Update Pharmacy Outlet
// @route   /api/pharmacist/outlet/update
// @access  PUT
const updatePharmacyOutlet = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        status: false,
        message: "Unauthorized",
      });
    }

    const pharmacyOutletId = req.query.pharmacyOutletId;
    const validatedPharmacySchema = updatePharmacyOutletSchema.safeParse(
      req.body
    );

    if (validatedPharmacySchema.error) {
      return sendResponse(res, 400, {
        message: validatedPharmacySchema.error.message,
      });
    }

    const validatedSchema: UpdatePharmacyOutletType =
      validatedPharmacySchema.data;

    const result = await pharmacistServices.updatePharmacyOutletService(
      Number(pharmacyOutletId),
      validatedSchema
    );

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

export default {
  addPharmacist,
  getAllPharmacists,
  deletePharmacist,
  getPharmacistById,
  addPharmacyOutlet,
  getPharmacyOutletById,
  deletePharmacyOutlet,
  getAllPharmacyOutlets,
  updatePharmacyOutlet,
};
