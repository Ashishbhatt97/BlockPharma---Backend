import { connect } from "http2";
import prisma from "../config/db.config";
import { inventoryDataAccess } from "../data access/inventoryDataAccess";

const addToInventoryService = async ({
  pharmacyOutletId,
  productId = null,
  stock,
  price,
  orderId = null,
  medicineName,
  medicineBrand,
  category,
  image,
  expiry,
}: any) => {
  console.log(
    pharmacyOutletId,
    medicineName,
    stock,
    price,
    orderId,
    medicineBrand,
    category,
    image,
    expiry
  );

  const existingItem = await inventoryDataAccess.findExisting(
    pharmacyOutletId,
    medicineName
  );
  console.log(existingItem, "existingItem");

  if (existingItem) {
    const updated = await inventoryDataAccess.update(existingItem.id, {
      stock: existingItem.stock + stock,
      orderId,
    });

    return {
      status: 200,
      message: "Inventory restocked",
      data: updated,
    };
  }

  const pharmacyOutlet = await prisma.pharmacyOutlet.findUnique({
    where: { id: pharmacyOutletId },
  });

  if (!pharmacyOutlet) {
    throw new Error(
      `Pharmacy outlet with ID ${pharmacyOutletId} does not exist`
    );
  }

  const created = await inventoryDataAccess.create({
    PharmacyOutlet: {
      connect: { id: pharmacyOutletId },
    },
    ...(productId && {
      Product: {
        connect: { id: productId },
      },
    }),
    ...(orderId && {
      Order: {
        connect: { id: orderId },
      },
    }),
    stock,
    price,
    medicineName,
    medicineBrand,
    category,
    image,
    expiry: new Date(expiry).toISOString(),
  });

  return {
    status: 201,
    message: "New inventory item added",
    data: "",
  };
};

const getInventoryByPharmacy = async (pharmacyOutletId: string) => {
  const items = await inventoryDataAccess.findAllByPharmacy(pharmacyOutletId);
  return {
    status: 200,
    message: "Inventory fetched successfully",
    data: items,
  };
};

const updateInventoryItem = async (id: string, data: any) => {
  const updated = await inventoryDataAccess.update(id, data);
  return {
    status: 200,
    message: "Inventory updated",
    data: updated,
  };
};

const deleteInventoryItem = async (id: string) => {
  const deleted = await inventoryDataAccess.remove(id);
  return {
    status: 200,
    message: "Inventory deleted",
    data: deleted,
  };
};

export const inventoryServices = {
  addToInventoryService,
  getInventoryByPharmacy,
  updateInventoryItem,
  deleteInventoryItem,
};
