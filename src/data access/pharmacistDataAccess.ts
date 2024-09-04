import prisma from "../config/db.config";
import convertBigIntToString from "../helper/convertBigIntToString";
import {
  PharmacyOutletType,
  UpdatePharmacyOutletType,
} from "../models/Pharmacy";

// Add Pharmacist
const addPharmacist = async (userId: string) => {
  try {
    const pharmacistExists = await prisma.pharmacist.findUnique({
      where: {
        userId,
      },
    });

    if (pharmacistExists) {
      return {
        status: 400,
        message: "Pharmacist already exists",
      };
    }

    const pharmacist = await prisma.pharmacist.create({
      data: {
        userId,
      },
    });

    if (!pharmacist) {
      return {
        status: 400,
        message: "Error adding pharmacist",
      };
    }

    const data = pharmacist
      ? {
          ...pharmacist,
          pharmacistId: pharmacist.pharmacistId.toString(), // Convert BigInt to string
        }
      : null;

    return {
      status: 200,
      message: "Pharmacist added successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Pharmacist
const getPharmacist = async (userId: string) => {
  try {
    const pharmacist = await prisma.pharmacist.findUnique({
      where: {
        userId,
      },
      include: {
        pharmacyOutlets: true,
      },
    });

    if (!pharmacist) {
      return {
        status: 400,
        message: "Pharmacist not found",
      };
    }

    const data = convertBigIntToString(pharmacist);

    return {
      status: 200,
      message: "Pharmacist found",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Delete Pharmacist
const deletePharmacist = async (userId: string) => {
  try {
    const pharmacist = await prisma.pharmacist.delete({
      where: {
        userId,
      },
      include: {
        pharmacyOutlets: true,
      },
    });

    if (!pharmacist) {
      return {
        status: 400,
        message: "Pharmacist not found",
      };
    }

    return {
      status: 200,
      message: "Pharmacist deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get All Pharmacists
const getAllPharmacists = async () => {
  try {
    const pharmacists = await prisma.pharmacist.findMany();

    if (!pharmacists) {
      return {
        status: 400,
        message: "Pharmacists not found",
        data: [],
      };
    }

    const data = convertBigIntToString(pharmacists);

    return {
      status: 200,
      message: "Pharmacists fetched successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Pharmacist By Id
const getPharmacistById = async (id: string) => {
  try {
    const pharmacist = await prisma.pharmacist.findUnique({
      where: {
        userId: id,
      },
      include: {
        pharmacyOutlets: true,
      },
    });

    if (!pharmacist) {
      return {
        status: 400,
        message: "Pharmacist not found",
      };
    }

    const data = convertBigIntToString(pharmacist);

    return {
      status: 200,
      message: "Pharmacist fetched successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Add Pharmacy Outlet
const addPharmacyOutlet = async (
  userId: string,
  validatedSchema: PharmacyOutletType
) => {
  try {
    const pharmacist = await prisma.pharmacist.findUnique({
      where: {
        userId,
      },
    });

    if (!pharmacist) {
      return {
        status: 400,
        message: "Pharmacist not found",
      };
    }

    const gstinExists = await prisma.pharmacyOutlet.findUnique({
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

    const emailExists = await prisma.pharmacyOutlet.findUnique({
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

    const pharmacyOutlet = await prisma.pharmacyOutlet.create({
      data: {
        ...validatedSchema,
        pharmacistOwnerId: pharmacist.pharmacistId,
        userId: pharmacist.userId,
      },
    });

    if (!pharmacyOutlet) {
      return {
        status: 400,
        message: "Error adding pharmacy outlet",
      };
    }

    const data = convertBigIntToString(pharmacyOutlet);

    return {
      status: 201,
      message: "Pharmacy outlet added successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get Pharmacy Outlet By Id
const getPharmacyOutletById = async (id: number) => {
  try {
    const pharmacyOutlet = await prisma.pharmacyOutlet.findUnique({
      where: {
        pharmacyOutletId: BigInt(id),
      },
    });

    if (!pharmacyOutlet) {
      return {
        status: 400,
        message: "Pharmacy outlet not found",
      };
    }

    const data = convertBigIntToString(pharmacyOutlet);

    return {
      status: 200,
      message: "Pharmacy outlet fetched successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Delete Pharmacy Outlet
const deletePharmacyOutlet = async (pharmacyOutletId: number) => {
  try {
    const pharmacyOutlet = await prisma.pharmacyOutlet.delete({
      where: {
        pharmacyOutletId,
      },
    });

    if (!pharmacyOutlet) {
      return {
        status: 400,
        message: "Pharmacy outlet not found",
      };
    }

    return {
      status: 200,
      message: "Pharmacy outlet deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Get All Pharmacy Outlets
const getAllPharmacyOutlets = async () => {
  try {
    const pharmacyOutlets = await prisma.pharmacyOutlet.findMany({
      select: {
        pharmacyOutletId: true,
        gstin: true,
        email: true,
        phoneNumber: true,
        street: true,
        city: true,
        state: true,
        pincode: true,
      },
    });

    const data = convertBigIntToString(pharmacyOutlets);

    return {
      status: 200,
      message: "Pharmacy outlets fetched successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

// Update Pharmacy Outlet
const updatePharmacyOutlet = async (
  pharmacyOutletId: number,
  validatedSchema: UpdatePharmacyOutletType
) => {
  try {
    const existingPharmacyOutlet = await prisma.pharmacyOutlet.findUnique({
      where: {
        pharmacyOutletId: BigInt(pharmacyOutletId),
      },
    });

    if (!existingPharmacyOutlet) {
      return {
        status: 404,
        message: "Pharmacy outlet not found",
      };
    }

    const pharmacyOutlet = await prisma.pharmacyOutlet.update({
      where: {
        pharmacyOutletId: BigInt(pharmacyOutletId),
      },
      data: {
        ...validatedSchema,
      },
    });

    const data = convertBigIntToString(pharmacyOutlet);

    return {
      status: 200,
      message: "Pharmacy outlet updated successfully",
      data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
};

export default {
  addPharmacist,
  getPharmacist,
  deletePharmacist,
  getAllPharmacists,
  getPharmacistById,
  addPharmacyOutlet,
  getPharmacyOutletById,
  deletePharmacyOutlet,
  getAllPharmacyOutlets,
  updatePharmacyOutlet,
};
