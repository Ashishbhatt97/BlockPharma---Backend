import vendorDataAccess from "../dataAccess/vendorDataAccess";
import { VendorSchemaType } from "../models/models";

//Add Vendor Service
const addVendorService = async (
  userId: string,
  vendorDetails: VendorSchemaType
) => {
  const res = await vendorDataAccess.addVendor(userId, vendorDetails);
  if (!res) {
    return {
      status: 400,
      error: "Error adding vendor",
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
  addVendorService,
};
