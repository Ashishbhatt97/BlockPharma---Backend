import bcrypt from "bcrypt";
import prisma from "../config/db.config";
import { tokenGenerator } from "../middleware/middlewares";
import {
  RegisterSchemaType,
  loginSchemaType,
  updateUserSchemaType,
} from "../models/Users";
import { AddressSchemaType } from "../models/Address";
import convertBigIntToString from "../helper/convertBigIntToString";
require("dotenv").config();

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
        profilePic: userObj.profilePic || null,
        oAuthId: userObj.oAuthId || null,
        provider: userObj.provider || null,
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
    const existingUser = await getUserById(userId);

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
    const existingUser = await getUserById(userId);

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
        message: `Congratulation!! You are Upgraded to ${userObj.role}`,
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
    const user = await getUserById(userId);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      return {
        status: 400,
        data: {
          message: "Invalid old password",
        },
      };
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

const deleteUser = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    const deletedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    if (!deletedUser) {
      return {
        status: 400,
        data: {
          status: false,
          message: "Error deleting user",
        },
      };
    }

    return {
      status: 200,
      data: {
        status: true,
        message: "User deleted successfully",
      },
    };
  } catch (error: any) {
    return {
      status: 400,
      data: {
        message: error.message,
      },
    };
  }
};

const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Address: true,
        VendorOrganization: true,
      },
    });

    if (!user || user!.isDeleted === true) {
      return null;
    }
    const userData = convertBigIntToString(user);

    console.log(userData);

    return userData;
  } catch (error: any) {
    return null;
  }
};

const isUserDeleted = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) return null;
  return user.isDeleted;
};

const addAddress = async (userId: string, addressObj: AddressSchemaType) => {
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    const newAddress = await prisma.address.create({
      data: {
        street: addressObj.street,
        city: addressObj.city,
        state: addressObj.state,
        country: addressObj.country,
        zipCode: addressObj.zipCode,
        userId: userId,
      },
    });

    if (!newAddress) {
      return {
        status: 400,
        message: "Failed to add address",
      };
    }

    return {
      status: 200,
      message: "Address added successfully",
      data: newAddress,
    };
  } catch (error: any) {
    return {
      status: 500,
      error: error.message,
    };
  }
};

const updateAddress = async (userId: string, addressObj: AddressSchemaType) => {
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    const updatedAddress = await prisma.address.update({
      where: {
        userId: userId,
      },
      data: {
        street: addressObj.street,
        city: addressObj.city,
        state: addressObj.state,
        country: addressObj.country,
        zipCode: addressObj.zipCode,
      },
    });

    if (!updatedAddress) {
      return {
        status: 400,
        message: "Failed to update address",
      };
    }

    return {
      status: 200,
      message: "Address updated successfully",
      data: {
        address: updatedAddress,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      error: error.message,
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
  deleteUser,
  getUserById,
  isUserDeleted,
  addAddress,
  updateAddress,
};
