import prisma from "../config/db.config";
import { BulkProductInput, Product, ProductInput } from "../models/Products";

// Create a single product
const createProduct = async (productData: ProductInput): Promise<Product> => {
  const product = await prisma.product.create({
    data: productData,
  });
  if (!product) {
    throw new Error("Failed to create product");
  }
  return {
    ...product,
    description: product.description ?? undefined,
    image: product.image ?? undefined,
  };
};

// Create multiple products
const createBulkProducts = async (
  productsData: BulkProductInput
): Promise<Product[]> => {
  const products = await prisma.$transaction(
    productsData.map((product: ProductInput) =>
      prisma.product.create({ data: product })
    )
  );
  return products.map((product) => ({
    ...product,
    description: product.description ?? undefined,
    image: product.image ?? undefined,
  }));
};

// Get products by vendor organization
const getProductsByVendor = async (vendorOrgId: string): Promise<Product[]> => {
  const products = await prisma.product.findMany({
    where: { vendorOrgId },
    include: {
      vendorOrg: {
        select: {
          businessName: true,
          gstin: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products.map((product) => ({
    ...product,
    description: product.description ?? undefined,
    image: product.image ?? undefined,
  }));
};

// Get product by ID
const getProductById = async (productId: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  return product
    ? {
        ...product,
        description: product.description ?? undefined,
        image: product.image ?? undefined,
      }
    : null;
};

// Update a product
const updateProduct = async (
  productId: string,
  productData: ProductInput
): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: productData,
  });

  return {
    ...product,
    description: product.description ?? undefined,
    image: product.image ?? undefined,
  };
};

// Delete a product
const deleteProduct = async (productId: string): Promise<void> => {
  await prisma.product.delete({
    where: { id: productId },
  });
};

// Get vendor organization by ID
const getVendorOrgById = async (vendorOrgId: string) => {
  const vendorOrg = await prisma.vendorOrganization.findUnique({
    where: { id: vendorOrgId },
  });
  return vendorOrg;
};

// Get multiple vendor organizations by IDs
const getVendorOrgsByIds = async (vendorOrgIds: string[]) => {
  const vendorOrgs = await prisma.vendorOrganization.findMany({
    where: { id: { in: vendorOrgIds } },
  });
  return vendorOrgs;
};

// Get order items by product ID
const getOrderItemsByProduct = async (productId: string) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { productId },
  });
  return orderItems;
};

// Get inventory items by product ID
const getInventoryItemsByProduct = async (productId: string) => {
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { productId },
  });
  return inventoryItems;
};

export default {
  createProduct,
  createBulkProducts,
  getProductsByVendor,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorOrgById,
  getVendorOrgsByIds,
  getOrderItemsByProduct,
  getInventoryItemsByProduct,
};
