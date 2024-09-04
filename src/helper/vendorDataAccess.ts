import prisma from "../config/db.config";
import { VendorOrganizationSchemaType } from "../models/Vendor";
import convertBigIntToString from "./convertBigIntToString";

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
  console.log(userId);

  try {
    await prisma.vendorOwner.findUnique({
      where: {
        userId,
      },
    });

    // if (!vendor) {
    //   return {
    //     status: 400,
    //     message: "Vendor not found",
    //   };
    // }

    // Ensure BigInt is serialized correctly
    // const data = vendor
    //   ? {
    //       ...vendor,
    //       vendorId: vendor.vendorId.toString(), // Convert BigInt to string
    //     }
    //   : null;

    return {
      status: 200,
      message: "Vendor found",
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

    const vendorId = vendorExists.vendorId
      ? BigInt(vendorExists.vendorId)
      : null;

    const organizationData: any = {
      vendorOwnerId: vendorId,
      businessName: validatedSchema.businessName,
      gstin: validatedSchema.gstin,
      email: validatedSchema.email,
      street: validatedSchema.street,
      city: validatedSchema.city,
      state: validatedSchema.state,
      pincode: Number(validatedSchema.pincode),
      isActive: validatedSchema.isActive ?? true,
      phoneNumber: validatedSchema.phoneNumber,
      website: validatedSchema.website,
    };

    const organization = await prisma.vendorOrganization.create({
      data: organizationData,
    });

    // If you need to return this as JSON, convert BigInt to string
    const organizationResponse = {
      ...organization,
      vendorOwnerId: organization.vendorOwnerId.toString(), // Convert BigInt to string if necessary
    };

    if (!organization) {
      return {
        status: 400,
        message: "Error adding organization",
      };
    }

    return {
      status: 201,
      message: "Organization added successfully",
      data: organizationResponse,
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
};
