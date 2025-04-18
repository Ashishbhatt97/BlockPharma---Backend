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
// const addPharmacist = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     if (!req.user) {
//       return sendResponse(res, 401, {
//         status: false,
//         message: "Unauthorized",
//       });
//     }

//     const { id } = req.user;
//     const result = await pharmacistServices.addPharmacistService(id);

//     if (!result || result.status !== undefined) {
//       sendResponse(res, result!.status, result);
//     }
//   }
// );

// // @desc    Get All Pharmacists
// // @route   /api/pharmacist/getall
// // @access  GET
// const getAllPharmacists = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     const result = await pharmacistServices.getAllPharmacistsService();

//     if (!result || result.status !== undefined) {
//       sendResponse(res, result!.status, result);
//     }
//   }
// );

// // @desc    Delete Pharmacist
// // @route   /api/pharmacist/delete
// // @access  DELETE

// const deletePharmacist = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     if (!req.user) {
//       return sendResponse(res, 401, {
//         status: false,
//         message: "Unauthorized",
//       });
//     }

//     const { id } = req.user;
//     const result = await pharmacistServices.deletePharmacistService(id);

//     if (!result || result.status !== undefined) {
//       sendResponse(res, result!.status, result);
//     }
//   }
// );

// // @desc    Get Pharmacist By Id
// // @route   /api/pharmacist/get
// // @access  GET
// const getPharmacistById = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     // if (!req.user) {
//     //   return sendResponse(res, 401, {
//     //     status: false,
//     //     message: "Unauthorized",
//     //   });
//     // }
//     // const { id } = req.user;
//     // const result = await pharmacistServices.getPharmacistByIdService(id);
//     // if (!result || result.status !== undefined) {
//     //   sendResponse(res, result!.status, result);
//     // }
//   }
// );

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

    const parsingData = {
      ...req.body,
      pharmacyOwnerId: req.body.pharmacyOwnerId,
    };

    const validatedPharmacySchema = pharmacyOutletSchema.safeParse(parsingData);
    if (!validatedPharmacySchema.success) {
      return sendResponse(res, 400, {
        status: false,
        message:
          validatedPharmacySchema.error.errors[0].message || "Validation error",
      });
    }

    const validatedSchema: PharmacyOutletType = validatedPharmacySchema.data;
    const { pharmacyOwnerId: pharmacyOwner } = validatedSchema;
    try {
      const result = await pharmacistServices.addPharmacyOutletService(
        pharmacyOwner!.toString(),
        validatedSchema
      );

      if (!result || result.status !== undefined) {
        return sendResponse(res, result!.status, result);
      }
    } catch (error: any) {
      return sendResponse(res, 500, {
        status: false,
        message: error.message || "Internal server error",
      });
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
    const { pharmacyOutletId } = req.body;

    const result = await pharmacistServices.getPharmacyOutletByIdService(
      pharmacyOutletId
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

    const pharmacyOutletId = req.body;

    const result = await pharmacistServices.deletePharmacyOutletService(
      pharmacyOutletId
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

    const { pharmacyOutletId } = req.body;
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
      pharmacyOutletId,
      validatedSchema
    );

    if (!result || result.status !== undefined) {
      sendResponse(res, result!.status, result);
    }
  }
);

export default {
  // addPharmacist,
  // getAllPharmacists,
  // deletePharmacist,
  // getPharmacistById,
  addPharmacyOutlet,
  getPharmacyOutletById,
  deletePharmacyOutlet,
  getAllPharmacyOutlets,
  updatePharmacyOutlet,
};
