import {
  VendorOrganizationSchemaType,
  VendorSchemaType,
} from "../models/models";
import vendorDataAccess from "../data access/vendorDataAccess";

// Add Vendor Service
const addVendorService = async (userId: string) => {
  const res = await vendorDataAccess.addVendor(userId);

  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: 400,
      error: res.message,
    };
  }

  if (res) {
    return {
      status: 201,
      message: res.message,
      data: res.data,
    };
  }
};

// Get Vendor Service
const getVendorService = async (userId: string) => {
  const res = await vendorDataAccess.getVendor(userId);

  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: 400,
      error: res.message,
    };
  }

  if (res) {
    return {
      status: 200,
      message: res.message,
      data: res.data,
    };
  }
};

// Delete Vendor Service
const deleteVendorService = async (userId: string) => {
  const res = await vendorDataAccess.deleteVendor(userId);

  if (!res || res.status === 400) {
    return {
      status: 400,
      error: res!.message,
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
    };
  }
};

// Add Organization Service
const addOrganizationService = async (
  userId: string,
  validatedSchema: VendorOrganizationSchemaType
) => {
  const res = await vendorDataAccess.addOrganization(userId, validatedSchema);

  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: 400,
      error: res.message,
    };
  }

  if (res) {
    return {
      status: 201,
      message: res.message,
      data: res.data,
    };
  }
};

// Get Organization Service
const getOrganizationService = async (orgId: number) => {
  const res = await vendorDataAccess.getOrganization(orgId);

  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: 400,
      error: res.message,
    };
  }

  if (res) {
    return {
      status: 200,
      message: res.message,
      data: res.data,
    };
  }
};

const deleteOrganizationService = async (orgId: number) => {
  const res = await vendorDataAccess.deleteOrganization(orgId);

  if (!res || res.status === 400) {
    return {
      status: 400,
      error: res.message,
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
    };
  }
};

export default {
  addVendorService,
  deleteVendorService,
  getVendorService,
  addOrganizationService,
  getOrganizationService,
  deleteOrganizationService,
};
