import prisma from "../config/db.config";
import convertBigIntToString from "../helper/convertBigIntToString";
import { VendorOrganizationSchemaType } from "../models/Vendor";

// Add Vendor
const addVendor = async (userId: string) => {
  try {
    const vendorExists = await prisma.vendorOwner.findUnique({
      where: {
        userId: userId,
      },
    });

    if (vendorExists) {
      return {
        status: 400,
        message: "Vendor already exists",
      };
    }

    const vendor = await prisma.vendorOwner.create({
      data: {
        userId,
      },
    });

    if (!vendor) {
      return {
        status: 400,
        message: "Error adding vendor",
      };
    }

    // Ensure BigInt is serialized correctly
    const data = vendor
      ? {
          ...vendor,
          vendorId: vendor.vendorId.toString(), // Convert BigInt to string
        }
      : null;

    return {
      status: 201,
      message: "Vendor added successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Vendor
const getVendor = async (userId: string) => {
  try {
    const vendor = await prisma.vendorOwner.findUnique({
      where: {
        userId: userId,
      },
      include: {
        VendorOrganizations: true,
      },
    });

    if (!vendor) {
      return {
        status: 400,
        message: "Vendor not found",
      };
    }

    // Ensure BigInt is serialized correctly
    const data = convertBigIntToString(vendor);

    return {
      status: 200,
      message: "Vendor found",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Delete Vendor
const deleteVendor = async (userId: string) => {
  try {
    const vendorExists = await prisma.vendorOwner.findUnique({
      where: {
        userId,
      },
    });

    if (!vendorExists) {
      return {
        status: 400,
        message: "Vendor not found",
      };
    }

    const vendor = await prisma.vendorOwner.delete({
      where: {
        userId,
      },
      include: {
        VendorOrganizations: true,
      },
    });

    if (!vendor) {
      return {
        status: 400,
        message: "Error deleting vendor",
      };
    }

    return {
      status: 200,
      message: "Vendor deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Add Organization
const addOrganization = async (
  userId: string,
  validatedSchema: VendorOrganizationSchemaType
) => {
  try {
    const vendorExists = await prisma.vendorOwner.findUnique({
      where: {
        userId,
      },
    });

    if (!vendorExists) {
      return {
        status: 400,
        message: "Vendor not found",
      };
    }

    const emailExists = await prisma.vendorOrganization.findUnique({
      where: {
        email: validatedSchema.email,
      },
    });

    if (emailExists) {
      return {
        status: 400,
        message: "Email already exists",
      };
    }

    const gstinExists = await prisma.vendorOrganization.findUnique({
      where: {
        gstin: validatedSchema.gstin,
      },
    });

    if (gstinExists) {
      return {
        status: 400,
        message: "GSTIN already exists",
      };
    }

    const userID = vendorExists.userId;

    const organization = await prisma.vendorOrganization.create({
      data: {
        vendorOwnerId: vendorExists.vendorId,
        phoneNumber: validatedSchema.phoneNumber,
        website: validatedSchema.website || "",
        userId: userID,
        businessName: validatedSchema.businessName,
        gstin: validatedSchema.gstin,
        email: validatedSchema.email,
        street: validatedSchema.street,
        city: validatedSchema.city,
        state: validatedSchema.state,
        pincode: Number(validatedSchema.pincode),
        isActive: validatedSchema.isActive ?? true,
      },
    });

    if (!organization) {
      return {
        status: 400,
        message: "Error adding organization",
      };
    }

    const data = organization
      ? {
          ...organization,
          orgId: organization.orgId.toString(),
          vendorOwnerId: organization.vendorOwnerId.toString(),
        }
      : null;

    return {
      status: 201,
      message: "Organization added successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Organization
const getOrganization = async (orgId: string) => {
  try {
    const organization = await prisma.vendorOrganization.findUnique({
      where: {
        orgId,
      },
    });

    if (!organization) {
      return {
        status: 400,
        message: "Organization not found",
      };
    }

    const data = convertBigIntToString(organization);

    return {
      status: 200,
      message: "Organization found",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Delete Organization
const deleteOrganization = async (orgId: string) => {
  try {
    const organization = await prisma.vendorOrganization.delete({
      where: {
        orgId: orgId,
      },
    });

    if (!organization) {
      return {
        status: 400,
        message: "Organization not found",
      };
    }

    return {
      status: 200,
      message: "Organization deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export default {
  addVendor,
  deleteVendor,
  getVendor,
  addOrganization,
  getOrganization,
  deleteOrganization,
};
