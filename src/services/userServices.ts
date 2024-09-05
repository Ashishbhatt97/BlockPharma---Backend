import { error } from "console";
import { userDataAccess } from "../data access/dataAccess";
import {
  loginSchemaType,
  RegisterSchemaType,
  updateUserSchemaType,
} from "../models/Users";
import { AddressSchemaType } from "../models/Address";

// User Registration Service
const userRegisterService = async (userObj: RegisterSchemaType) => {
  try {
    const res = await userDataAccess.createUser(userObj);

    if (res.status === 201) {
      return {
        status: res?.status,
        message: res?.data.message,
      };
    }

    return {
      status: res?.status,
      message: res.data.message,
    };
  } catch (error) {
    return {
      status: 400,
      error: "Error parsing user data",
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
          message: res.data?.message || "Login successful",
          data: {
            user: res.data?.user || null,
            token: res.data?.token || null,
          },
        };
      } else if (res.status === 401) {
        return {
          status: 401,
          message: "Invalid email or password",
          data: {
            user: null,
            token: null,
          },
        };
      } else {
        // Handle other status codes if necessary
        return {
          status: res.status,
          message: res.data?.message || "An error occurred",
          data: {
            user: null,
            token: null,
          },
        };
      }
    }

    // Handle cases where `res` is undefined or does not have a status
    return {
      status: 400,
      message: "Invalid response format",
      data: {
        user: null,
        token: null,
      },
    };
  } catch (error) {
    return {
      status: 400,
      message: "Error parsing user data",
      data: {
        user: null,
        token: null,
      },
    };
  }
};

//User Update Service
const updateUserDetailsService = async (
  userId: string,
  userObj: updateUserSchemaType
) => {
  try {
    const res = await userDataAccess.updateUserDetails(userId, userObj);

    if (!res || res.status !== 200) {
      return {
        status: res?.status,
        data: {
          message: res?.data.message,
        },
      };
    }

    if (res.status === 200) {
      return {
        status: 200,
        message: res?.data.message,
        data: {
          user: res?.data.user,
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      error: "Error parsing user data",
    };
  }
};
//Become Supplier Service
const upgradeUserService = async (
  userId: string,
  userObj: updateUserSchemaType
) => {
  try {
    const res = await userDataAccess.upgradeUser(userId, userObj);
    if (!res || res.status !== 200) {
      return {
        status: res?.status,
        message: res?.data.message,
      };
    }

    if (res.status === 200) {
      return {
        status: 200,
        message: res?.data.message,
        data: {
          user: res?.data.user,
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      data: {
        message: "Error parsing user data",
      },
    };
  }
};

//Change Password Service
const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const res = await userDataAccess.changePassword(
    userId,
    oldPassword,
    newPassword
  );

  if (!res) {
    return {
      status: 404,
      error: "User not found",
    };
  }

  if (res.status === 400) {
    return {
      status: 400,
      message: res?.data.message,
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res?.data.message,
    };
  }
};

//Delete User Service
const deleteUserService = async (userId: string) => {
  const res = await userDataAccess.deleteUser(userId);
  if (!res || res.status !== 200) {
    return {
      status: 400,
      message: "Error deleting user",
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      data: {
        message: res?.data.message,
      },
    };
  }
};

//Get User By Id Service
const getUserByIdService = async (userId: string) => {
  try {
    const res = await userDataAccess.getUserById(userId);
    if (!res) {
      return {
        status: 400,
        error: {
          message: "Error getting user",
        },
      };
    }
    if (res) {
      return {
        status: 200,
        message: "User fetched successfully",
        data: res,
      };
    }
  } catch (error) {
    return {
      status: 400,
      data: {
        message: "Error getting user",
      },
    };
  }
};

//Add Address Service
const addAddressService = async (
  userId: string,
  addressObj: AddressSchemaType
) => {
  const res = await userDataAccess.addAddress(userId, addressObj);
  if (!res) {
    return {
      status: 400,
      error: "Error adding address",
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
      data: res.data,
    };
  }
};

//Update Address Service
const updateAddressService = async (
  userId: string,
  addressObj: AddressSchemaType
) => {
  const res = await userDataAccess.updateAddress(userId, addressObj);
  if (!res) {
    return {
      status: 400,
      error: "Error updating address",
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
      data: res.data,
    };
  }
};

export default {
  userRegisterService,
  userLoginService,
  updateUserDetailsService,
  upgradeUserService,
  changePasswordService,
  deleteUserService,
  getUserByIdService,
  addAddressService,
  updateAddressService,
};
