import prisma from "../config/db.config";
import { RegisterSchemaType } from "../models/Users";
import bcrypt from "bcrypt";

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
        phoneNumber: Number(userObj.phoneNumber),
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

export default { createUser, findUserByEmail };
