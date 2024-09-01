import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import sendResponse from "../helper/responseHelper";
import { userServices } from "../services/services";
import {
  signupSchema,
  loginSchemaType,
  loginSchema,
  RegisterSchemaType,
  updateUserSchemaType,
  updateUserSchema,
} from "../models/Users";
import { CustomRequest } from "../middleware/jwtAuthentication";

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

  let result = await userServices.userRegisterService(validatedData);

  sendResponse(res, result!.status, result.data);
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
const updateUser = asyncHandler(async (req: CustomRequest, res: Response) => {
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

  const result = await userServices.updateUserService(id, validatedData);

  sendResponse(res, result!.status, result);
});

export default {
  userRegister,
  userLogin,
  updateUser,
};
