import prisma from "../config/db.config";
import { RegisterSchemaType } from "../models/Users";
import bcrypt from "bcrypt";
import { userDataAccess } from "../data access/dataAccess";
const userRegisterService = async (userObj: RegisterSchemaType) => {
  try {
    const res = await userDataAccess.createUser(userObj);

    if (res.status === 201) {
      return {
        status: res?.status,
        data: {
          status: true,
          message: res?.data.message,
        },
      };
    }

    return {
      status: res?.status,
      data: {
        status: false,
        message: res.data.message,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        status: false,
        message: "Error parsing user data",
      },
    };
  }
};

export default { userRegisterService };
