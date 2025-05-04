import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import sendResponse from "../helper/responseHelper";
import AddressSchema, { AddressSchemaType } from "../models/Address";
import {
  completeProfileSchema,
  completeProfileSchemaType,
  loginSchema,
  loginSchemaType,
  RegisterSchemaType,
  signupSchema,
  updateUserSchema,
  updateUserSchemaType,
} from "../models/Users";
import { userServices } from "../services/services";
import userDataAccess from "../data access/userDataAccess";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}
// @desc    User Registration
// @route   /api/user/register
// @access  POST
const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);

  if (!parseResult.success) {
    sendResponse(res, 400, {
      error: parseResult.error.issues[0].message,
    });
    return;
  }

  const validatedData: RegisterSchemaType = parseResult.data;

  if (req.file) {
    validatedData.profilePic = `/uploads/profilePics/${req.file.filename}`;
  }

  const result = await userServices.userRegisterService(validatedData);
  sendResponse(res, result!.status, result);
});

// @desc    User Login Handler
// @route   /api/user/login
// @access  POST
const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    sendResponse(res, 400, {
      error: parseResult.error.issues[0].message,
    });
    return;
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
const updateUserDetails = asyncHandler(async (req: Request, res: Response) => {
  const parseResult = updateUserSchema.safeParse(req.body);

  if (!parseResult.success) {
    sendResponse(res, 400, {
      message: parseResult.error.issues[0].message,
    });
    return;
  }

  const validatedData: updateUserSchemaType = parseResult.data;

  if (req.file) {
    validatedData.profilePic = `/uploads/profilePics/${req.file.filename}`;
  }

  const result = await userServices.updateUserDetailsService(
    validatedData.id,
    validatedData
  );

  sendResponse(res, result!.status, result);
});

// @desc    Update User to Supplier and Pharmacy
// @route   /api/user/upgradeUser
// @access  PUT
const upgradeUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }

    const parseResult = updateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      sendResponse(res, 400, {
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const validatedData: updateUserSchemaType = parseResult.data;
    const result = await userServices.upgradeUserService(id, validatedData);

    sendResponse(res, result!.status, result);
  }
);

// @desc    User change Password
// @route   /api/user/changepassword
// @access  PUT
const changePassword = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
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
const deleteUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.body;
    const result = await userServices.deleteUserService(id);

    if (result?.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Get User by Id
// @route   /api/user/getdetails
// @access  GET
const getUserById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const result = await userServices.getUserByIdService(id);

    if (result?.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Add Address
// @route   /api/user/addAddress
// @access  POST
const addAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const parseResult = AddressSchema.safeParse(req.body);

    if (!parseResult.success) {
      sendResponse(res, 400, {
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const validatedData: AddressSchemaType = parseResult.data;
    const result = await userServices.addAddressService(id, validatedData);

    sendResponse(res, result!.status, result);
  }
);

// @desc    Update Address
// @route   /api/user/updateAddress
// @access  PUT
const updateAddress = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const parseResult = AddressSchema.safeParse(req.body);

    if (!parseResult.success) {
      sendResponse(res, 400, {
        message: parseResult.error.issues[0].message,
      });
      return;
    }

    const validatedData: AddressSchemaType = parseResult.data;
    const result = await userServices.updateAddressService(id, validatedData);

    sendResponse(res, result!.status, result);
  }
);

// @desc    Me Query
// @route   /api/user/me
// @access  GET
const meQuery = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      return sendResponse(res, 401, { message: "Unauthorized" });
    }
    const result = await userServices.meService(id);

    if (result?.status !== undefined) {
      sendResponse(res, result.status, result);
    }
  }
);

// @desc    Complete Profile
// @route   /api/user/complete-profile
// @access  POST
const completeProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  let profilePic = "";

  if (req.file) {
    profilePic = `/uploads/profilePics/${req.file.filename}`;
  }

  const profileData = {
    ...req.body,
    profilePic,
    userId,
  };

  const parseResult = completeProfileSchema.safeParse(profileData);

  if (!parseResult.success) {
    sendResponse(res, 400, {
      message: parseResult.error.issues[0].message,
    });
    return;
  }

  const validatedData: completeProfileSchemaType = parseResult.data;
  const result = await userServices.completeProfileService(
    userId,
    validatedData
  );

  sendResponse(res, result!.status, result);
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userDataAccess.getAllUsers();
  sendResponse(res, 200, result);
});

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
  meQuery,
  completeProfile,
  getAllUsers,
};
