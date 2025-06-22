import { ProductInput, BulkProductInput, Product } from "../models/Products";
import { productDataAccess } from "../data access/dataAccess";
import { Product as PrismaProduct } from "@prisma/client";

// Create a single product
const createProduct = async (productData: ProductInput) => {
  try {
    // Validate vendor organization exists
    const vendorOrg = await productDataAccess.getVendorOrgById(
      productData.vendorOrgId
    );
    if (!vendorOrg) {
      return {
        status: 404,
        error: "Vendor organization not found",
      };
    }

    const product = await productDataAccess.createProduct(productData);
    return {
      status: 201,
      data: product,
      message: "Product created successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error creating product",
    };
  }
};

// Create multiple products
const createBulkProducts = async (productsData: BulkProductInput) => {
  try {
    // Get unique vendor org IDs from the products
    const vendorOrgIds = [...new Set(productsData.map((p) => p.vendorOrgId))];

    // Verify all vendor organizations exist
    const vendorOrgs = await productDataAccess.getVendorOrgsByIds(vendorOrgIds);
    if (vendorOrgs.length !== vendorOrgIds.length) {
      return {
        status: 404,
        error: "One or more vendor organizations not found",
      };
    }

    const products = await productDataAccess.createBulkProducts(productsData);
    return {
      status: 201,
      data: products,
      message: "Products created successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error creating products",
    };
  }
};

// Get products by vendor organization
const getProductsByVendor = async (vendorOrgId: string) => {
  try {
    const products = await productDataAccess.getProductsByVendor(vendorOrgId);
    return {
      status: 200,
      data: products,
      message: "Products fetched successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error fetching products",
    };
  }
};

// Update a product
const updateProduct = async (productId: string, productData: ProductInput) => {
  try {
    // Check if product exists
    const existingProduct = await productDataAccess.getProductById(productId);
    if (!existingProduct) {
      return {
        status: 404,
        error: "Product not found",
      };
    }

    // Validate vendor organization exists if it's being updated
    if (productData.vendorOrgId !== existingProduct.vendorOrgId) {
      const vendorOrg = await productDataAccess.getVendorOrgById(
        productData.vendorOrgId
      );
      if (!vendorOrg) {
        return {
          status: 404,
          error: "Vendor organization not found",
        };
      }
    }

    const updatedProduct = await productDataAccess.updateProduct(
      productId,
      productData
    );
    return {
      status: 200,
      data: updatedProduct,
      message: "Product updated successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error updating product",
    };
  }
};

// Delete a product
const deleteProduct = async (productId: string) => {
  try {
    // Check if product exists
    const existingProduct = await productDataAccess.getProductById(productId);
    if (!existingProduct) {
      return {
        status: 404,
        error: "Product not found",
      };
    }

    // Check if product is referenced in any order or inventory
    // const [orderItems, inventoryItems] = await Promise.all([
    //   productDataAccess.getOrderItemsByProduct(productId),
    //   productDataAccess.getInventoryItemsByProduct(productId),
    // ]);

    // if (orderItems.length > 0 || inventoryItems.length > 0) {
    //   return {
    //     status: 400,
    //     error: "Cannot delete product that exists in orders or inventory",
    //   };
    // }

    await productDataAccess.deleteProduct(productId);
    return {
      status: 204,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    return {
      status: 400,
      error: error.message || "Error deleting product",
    };
  }
};

export default {
  createProduct,
  createBulkProducts,
  getProductsByVendor,
  updateProduct,
  deleteProduct,
};
