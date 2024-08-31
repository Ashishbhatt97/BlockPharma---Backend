import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import sendResponse from "../helper/responseHelper";
import { signupSchema } from "../models/models";
import { userServices } from "../services/services";
import { RegisterSchemaType } from "../models/Users";

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

export default {
  userRegister,
};
