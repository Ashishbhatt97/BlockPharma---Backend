import { Request, Response } from "express";
import sendResponse from "../helper/responseHelper";
import asyncHandler from "../middleware/asyncHandler";
import { CustomRequest } from "../middleware/jwtAuthentication";
import AddressSchema, { AddressSchemaType } from "../models/Address";
import {
  loginSchema,
  loginSchemaType,
  RegisterSchemaType,
  signupSchema,
  updateUserSchema,
  updateUserSchemaType,
} from "../models/Users";
import { userServices } from "../services/services";

// @desc    User Registration
// @route   /api/user/register
// @access  POST
const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);

  if (!parseResult.success) {
    return sendResponse(res, 400, {
      error: parseResult.error.issues[0].message,
    });
  }

  // Extract validated data
  const validatedData: RegisterSchemaType = parseResult.data;

  // Add profile picture file path if it exists
  if (req.file) {
    validatedData.profilePic = `/uploads/profilePics/${req.file.filename}`;
  }

  let result = await userServices.userRegisterService(validatedData);

  sendResponse(res, result!.status, result);
});

// @desc    User Login Handler
// @route   /api/user/login
// @access  POST
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return sendResponse(res, 400, {
      error: parseResult.error.issues[0].message,
    });
  }
  const validatedData: loginSchemaType = parseResult.data;

  const result = await userServices.userLoginService(validatedData);

  if (result?.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    User Details Update Handler
// @route   /api/user/update
// @access  PUT
const updateUserDetails = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const { id } = req.user;

    const parseResult = updateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return sendResponse(res, 400, {
        message: parseResult.error.issues[0].message,
      });
    }

    const validatedData: updateUserSchemaType = parseResult.data;

    // Add profile picture file path if it exists
    if (req.file) {
      validatedData.profilePic = `/uploads/profilePics/${req.file.filename}`;
    }

    const result = await userServices.updateUserDetailsService(
      id,
      validatedData
    );

    sendResponse(res, result!.status, result);
  }
);

// @desc    Update User to Supplier and Pharmacy
// @route   /api/user/upgradeUser
// @access  PUT
const upgradeUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const parseResult = updateUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    return sendResponse(res, 400, {
      message: parseResult.error.issues[0].message,
    });
  }

  const validatedData: updateUserSchemaType = parseResult.data;

  const result = await userServices.upgradeUserService(id, validatedData);

  sendResponse(res, result!.status, result);
});

// @desc    User change Password
// @route   /api/user/changepassword
// @access  PUT
const changePassword = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const result = await userServices.changePasswordService(
      id,
      oldPassword,
      newPassword
    );

    if (result?.status !== undefined) {
      sendResponse(res, result?.status, result);
    }
  }
);

// @desc    User delete
// @route   /api/user/delete
// @access  DELETE
const deleteUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const result = await userServices.deleteUserService(id);

  if (result?.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Get User by Id
// @route   /api/user/getdetails
// @access  GET
const getUserById = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;

  const result = await userServices.getUserByIdService(id);

  if (result?.status !== undefined) {
    sendResponse(res, result.status, result);
  }
});

// @desc    Add Address
// @route   /api/user/addAddress
// @access  POST
const addAddress = asyncHandler(async (req: CustomRequest, res: Response) => {
  if (!req.user) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  const { id } = req.user;
  const parseResult = AddressSchema.safeParse(req.body);

  if (!parseResult.success) {
    return sendResponse(res, 400, {
      message: parseResult.error.issues[0].message,
    });
  }

  const validatedData: AddressSchemaType = parseResult.data;
  console.log(validatedData);

  const result = await userServices.addAddressService(id, validatedData);

  sendResponse(res, result!.status, result);
});

// @desc    Update Address
// @route   /api/user/updateAddress
// @access  PUT
const updateAddress = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const { id } = req.user;
    const parseResult = AddressSchema.safeParse(req.body);

    if (!parseResult.success) {
      return sendResponse(res, 400, {
        message: parseResult.error.issues[0].message,
      });
    }

    const validatedData: AddressSchemaType = parseResult.data;

    const result = await userServices.updateAddressService(id, validatedData);

    sendResponse(res, result!.status, result);
  }
);

export default {
  userRegister,
  userLogin,
  updateUserDetails,
  upgradeUser,
  changePassword,
  deleteUser,
  getUserById,
  addAddress,
  updateAddress,
};
