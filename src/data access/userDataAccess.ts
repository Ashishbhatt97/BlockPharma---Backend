import prisma from "../config/db.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterSchemaType,
  loginSchemaType,
  updateUserSchemaType,
} from "../models/Users";
require("dotenv").config();
import { tokenGenerator } from "../middleware/middlewares";

const SECRET = process.env.SECRET_KEY;

const createUser = async (userObj: RegisterSchemaType) => {
  try {
    //check whether user already exists or not
    const userExists = await findUserByEmail(userObj.email);

    if (userExists) {
      return {
        status: 409,
        data: {
          message: "User already exists",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(userObj.password, 10);

    const res = await prisma.user.create({
      data: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        password: hashedPassword,
        phoneNumber: userObj.phoneNumber,
        isDeleted: false,
      },
    });

    if (!res) {
      return {
        status: 400,
        data: {
          status: false,
          message: "Failed to create user",
        },
      };
    }

    return {
      status: 201,
      data: {
        status: true,
        message: "User created successfully",
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: false,
        message: error.message || "An error occurred while creating the user",
      },
    };
  }
};

const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) return true;
  } catch (error) {
    return false;
  }
};

const loginUser = async (userObj: loginSchemaType) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userObj.email,
      },
    });
    if (!user) return null;

    if (user) {
      const isValidPassword = await bcrypt.compare(
        userObj.password,
        user.password
      );

      if (!isValidPassword) return null;

      if (!SECRET) {
        return {
          status: 400,
          message: "Invalid SECRET",
        };
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = tokenGenerator(payload);

      return {
        status: 200,
        data: {
          status: true,
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
          },
          token: token,
        },
      };
    }
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: false,
        message: error.message,
      },
    };
  }
};

const updateUserDetails = async (
  userId: string,
  userObj: updateUserSchemaType
) => {
  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return {
        status: 404,
        data: {
          status: false,
          message: "User not found.",
        },
      };
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        phoneNumber: userObj.phoneNumber,
        isDeleted: false,
      },
    });

    return {
      status: 200,
      data: {
        status: true,
        message: "User updated successfully.",
        user: updatedUser,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: false,
        message: error.message,
      },
    };
  }
};

const upgradeUser = async (userId: string, userObj: updateUserSchemaType) => {
  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return {
        status: 404,
        data: {
          status: false,
          message: "User not found.",
        },
      };
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: userObj.role,
      },
    });

    return {
      status: 200,
      data: {
        status: true,
        message: "Congratulation!! You are Upgraded to Supplier",
        user: updatedUser,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: false,
        message: error.message,
      },
    };
  }
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return null;

    if (user) {
      const isValidPassword = bcrypt.compare(oldPassword, user.password);

      if (!isValidPassword) return null;
    }

    //Hashed New Password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    const passwordRes = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });
    console.log(passwordRes);
    if (!passwordRes) {
      return {
        status: false,
        data: {
          message: "Failed to update password",
        },
      };
    }

    return {
      status: 200,
      data: {
        status: true,
        message: "Password Updated Successfully",
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        message: error.message,
      },
    };
  }
};

export default {
  createUser,
  findUserByEmail,
  loginUser,
  updateUserDetails,
  upgradeUser,
  changePassword,
};
