import prisma from "../config/db.config";
import convertBigIntToString from "../helper/convertBigIntToString";
import { VendorOrganizationSchemaType } from "../models/Vendor";

// Add Vendor Organization directly
const addVendorOrganization = async (
  userId: string,
  validatedSchema: VendorOrganizationSchemaType
) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
        role: "SUPPLIER",
      },
    });
    console.log(userExists);
    if (!userExists) {
      return {
        status: 400,
        message: "User not found",
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
    const organization = await prisma.vendorOrganization.create({
      data: {
        ownerId: userId,
        businessName: validatedSchema.businessName,
        phoneNumber: validatedSchema.phoneNumber,
        website: validatedSchema.website || "",
        gstin: validatedSchema.gstin,
        email: validatedSchema.email,
        street: validatedSchema.street,
        city: validatedSchema.city,
        state: validatedSchema.state,
        pincode: validatedSchema.pincode,
        isActive: true,
      },
    });

    if (!organization) {
      return {
        status: 400,
        message: "Error adding vendor organization",
      };
    }

    return {
      status: 201,
      message: "Vendor organization added successfully",
      data: organization,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Vendor Organizations for a specific user
const getVendorOrganizations = async (userId: string) => {
  try {
    const organizations = await prisma.vendorOrganization.findMany({
      where: {
        ownerId: userId,
      },
    });

    if (!organizations || organizations.length === 0) {
      return {
        status: 404,
        message: "No vendor organizations found for this user",
      };
    }

    // Ensure BigInt is serialized correctly
    const data = organizations.map((org) => convertBigIntToString(org));

    return {
      status: 200,
      message: "Vendor organizations found",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get a specific organization
const getOrganization = async (orgId: string) => {
  try {
    const organization = await prisma.vendorOrganization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!organization) {
      return {
        status: 404,
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

// Update organization
const updateOrganization = async (
  orgId: string,
  validatedSchema: Partial<VendorOrganizationSchemaType>
) => {
  try {
    // Check if organization exists
    const orgExists = await prisma.vendorOrganization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!orgExists) {
      return {
        status: 404,
        message: "Organization not found",
      };
    }

    // If email is being updated, check if it already exists
    if (validatedSchema.email && validatedSchema.email !== orgExists.email) {
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
    }

    // If GSTIN is being updated, check if it already exists
    if (validatedSchema.gstin && validatedSchema.gstin !== orgExists.gstin) {
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
    }

    // Update organization
    const organization = await prisma.vendorOrganization.update({
      where: {
        id: orgId,
      },
      data: {
        ...(validatedSchema.businessName && {
          businessName: validatedSchema.businessName,
        }),
        ...(validatedSchema.phoneNumber && {
          phoneNumber: validatedSchema.phoneNumber,
        }),
        ...(validatedSchema.website && { website: validatedSchema.website }),
        ...(validatedSchema.gstin && { gstin: validatedSchema.gstin }),
        ...(validatedSchema.email && { email: validatedSchema.email }),
        ...(validatedSchema.street && { street: validatedSchema.street }),
        ...(validatedSchema.city && { city: validatedSchema.city }),
        ...(validatedSchema.state && { state: validatedSchema.state }),
        ...(validatedSchema.pincode && { pincode: validatedSchema.pincode }),
      },
    });

    const data = convertBigIntToString(organization);

    return {
      status: 200,
      message: "Organization updated successfully",
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
        id: orgId,
      },
    });

    if (!organization) {
      return {
        status: 404,
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

// Get All Vendor Organizations
const getAllVendorOrganizations = async () => {
  try {
    const organizations = await prisma.vendorOrganization.findMany({
      where: {
        isActive: true,
      },
    });

    if (!organizations || organizations.length === 0) {
      return [];
    }

    return organizations.map((org) => convertBigIntToString(org));
  } catch (error: any) {
    return null;
  }
};

// Toggle organization active status
const toggleOrganizationStatus = async (orgId: string) => {
  try {
    const organization = await prisma.vendorOrganization.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!organization) {
      return {
        status: 404,
        message: "Organization not found",
      };
    }

    const updatedOrganization = await prisma.vendorOrganization.update({
      where: {
        id: orgId,
      },
      data: {
        isActive: !organization.isActive,
      },
    });

    const data = convertBigIntToString(updatedOrganization);

    return {
      status: 200,
      message: `Organization ${
        updatedOrganization.isActive ? "activated" : "deactivated"
      } successfully`,
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export default {
  addVendorOrganization,
  getVendorOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getAllVendorOrganizations,
  toggleOrganizationStatus,
};
