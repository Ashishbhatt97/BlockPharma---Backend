import prisma from "../config/db.config";

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
    const data = vendor
      ? {
          ...vendor,
          vendorId: vendor.vendorId.toString(), // Convert BigInt to string
        }
      : null;

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

export default {
  addVendor,
  deleteVendor,
  getVendor,
};
