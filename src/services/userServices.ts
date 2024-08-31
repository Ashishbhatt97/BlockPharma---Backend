import { userDataAccess } from "../data access/dataAccess";
import { loginSchemaType, RegisterSchemaType } from "../models/Users";

// User Registration Service
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

// User Login Service
const userLoginService = async (userObj: loginSchemaType) => {
  try {
    const res = await userDataAccess.loginUser(userObj);

    if (!res || res.status !== 200) {
      return {
        status: res?.status,
        data: {
          status: false,
          message: res?.data.message,
        },
      };
    }

    if (res.status === 200) {
      return {
        status: 200,
        message: res?.data.message,
        body: {
          user: res?.data.user,
          token: res?.data.token,
        },
      };
    }
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

export default { userRegisterService, userLoginService };
