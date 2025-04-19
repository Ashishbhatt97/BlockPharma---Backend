import { VendorOrganizationSchemaType } from "../models/Vendor";
import vendorDataAccess from "../data access/vendorDataAccess";

const getVendorOrganizationsService = async (userId: string) => {
  const res = await vendorDataAccess.getVendorOrganizations(userId);

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error fetching vendor organizations",
    };
  }

  return {
    status: 200,
    message: res.message,
    data: res.data,
  };
};

// Add Vendor Organization Service
const addVendorOrganizationService = async (
  userId: string,
  validatedSchema: VendorOrganizationSchemaType
) => {
  const res = await vendorDataAccess.addVendorOrganization(
    userId,
    validatedSchema
  );

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error adding vendor organization",
    };
  }

  return {
    status: 201,
    message: res.message,
    data: res.data,
  };
};

// Get Organization Service
const getOrganizationService = async (orgId: string) => {
  const res = await vendorDataAccess.getOrganization(orgId);

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error fetching organization",
    };
  }

  return {
    status: 200,
    message: res.message,
    data: res.data,
  };
};

// Update Organization Service
const updateOrganizationService = async (
  orgId: string,
  validatedSchema: Partial<VendorOrganizationSchemaType>
) => {
  const res = await vendorDataAccess.updateOrganization(orgId, validatedSchema);

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error updating organization",
    };
  }

  return {
    status: 200,
    message: res.message,
    data: res.data,
  };
};

// Delete Organization Service
const deleteOrganizationService = async (orgId: string) => {
  const res = await vendorDataAccess.deleteOrganization(orgId);

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error deleting organization",
    };
  }

  return {
    status: 200,
    message: res.message,
  };
};

// Get All Vendor Organizations Service
const getAllVendorOrganizationsService = async () => {
  const res = await vendorDataAccess.getAllVendorOrganizations();

  if (!res) {
    return {
      status: 400,
      error: "Error fetching vendor organizations",
    };
  }

  return {
    status: 200,
    message: "Vendor organizations fetched successfully",
    data: res,
  };
};

// Toggle Organization Status Service
const toggleOrganizationStatusService = async (orgId: string) => {
  const res = await vendorDataAccess.toggleOrganizationStatus(orgId);

  if (!res || res.status >= 400) {
    return {
      status: res?.status || 400,
      error: res?.message || "Error toggling organization status",
    };
  }

  return {
    status: 200,
    message: res.message,
    data: res.data,
  };
};

export default {
  getVendorOrganizationsService,
  addVendorOrganizationService,
  getOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
  getAllVendorOrganizationsService,
  toggleOrganizationStatusService,
};
