import { userDataAccess } from "../data access/dataAccess";
import {
  loginSchemaType,
  RegisterSchemaType,
  updateUserSchemaType,
} from "../models/Users";

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

    if (!res) return { error: "Invalid Credentials", status: 400 };

    // Ensure `res` is defined and contains a `status` property
    if (res) {
      if (res.status === 200) {
        return {
          status: 200,
          data: {
            message: res.data?.message || "Login successful",
            user: res.data?.user || null,
            token: res.data?.token || null,
          },
        };
      } else if (res.status === 401) {
        return {
          status: 401,
          data: {
            message: "Invalid email or password",
            user: null,
            token: null,
          },
        };
      } else {
        // Handle other status codes if necessary
        return {
          status: res.status,
          data: {
            message: res.data?.message || "An error occurred",
            user: null,
            token: null,
          },
        };
      }
    }

    // Handle cases where `res` is undefined or does not have a status
    return {
      status: 400,
      data: {
        message: "Invalid response format",
        user: null,
        token: null,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        message: "Error parsing user data",
        user: null,
        token: null,
      },
    };
  }
};

//User Update Service
const updateUserService = async (
  userId: string,
  userObj: updateUserSchemaType
) => {
  try {
    const res = await userDataAccess.updateUser(userId, userObj);

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
        data: {
          message: res?.data.message,
          user: res?.data.user,
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

export default { userRegisterService, userLoginService, updateUserService };
