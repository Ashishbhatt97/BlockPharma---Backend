import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import sendResponse from "../helper/responseHelper";
import { ProductInput, BulkProductInput } from "../models/Products";
import { productServices } from "../services/services";

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Supplier
const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await productServices.createProduct(req.body);
  sendResponse(res, result.status, result);
});

// @desc    Create bulk products
// @route   POST /api/products/bulk
// @access  Private/Supplier
const createBulkProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productServices.createBulkProducts(req.body);
  sendResponse(res, result.status, result);
});

// @desc    Get products by vendor
// @route   GET /api/products/vendor/:vendorOrgId
// @access  Private
const getProductsByVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const { vendorOrgId } = req.params;
    const result = await productServices.getProductsByVendor(vendorOrgId);
    sendResponse(res, result.status, result);
  }
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Supplier
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productServices.updateProduct(id, req.body);
  sendResponse(res, result.status, result);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Supplier
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productServices.deleteProduct(id);
  sendResponse(res, result.status, result);
});

export default {
  createProduct,
  createBulkProducts,
  getProductsByVendor,
  updateProduct,
  deleteProduct,
};
