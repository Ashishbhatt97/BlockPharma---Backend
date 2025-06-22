import prisma from "../config/db.config";

const create = async (data: any) => {
  return await prisma.inventoryItem.create({ data });
};

const findAllByPharmacy = async (pharmacyOutletId: string) => {
  return await prisma.inventoryItem.findMany({
    where: { pharmacyOutletId },
    include: { Product: true },
  });
};

const update = async (id: string, data: any) => {
  return await prisma.inventoryItem.update({
    where: { id },
    data,
  });
};

const remove = async (id: string) => {
  return await prisma.inventoryItem.delete({ where: { id } });
};

const findExisting = async (pharmacyOutletId: string, medicineName: string) => {
  return await prisma.inventoryItem.findFirst({
    where: { pharmacyOutletId, medicineName },
  });
};

export const inventoryDataAccess = {
  create,
  findAllByPharmacy,
  update,
  remove,
  findExisting,
};
