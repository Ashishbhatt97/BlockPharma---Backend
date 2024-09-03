import prisma from "../config/db.config";

const addVendor = async (userId: string, vendorDetails: VendorSchemaType) => {
  const vendor = await prisma.vendorOwner.create({
    ...vendorDetails,
    userId,
  });

  return vendor;
};

export default {
  addVendor,
};
