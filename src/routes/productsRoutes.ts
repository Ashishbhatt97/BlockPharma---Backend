import express from "express";
import productController from "../controllers/ProductsControllers";
import {
  jwtAuth,
  checkSupplier,
  checkSupplierOrAdmin,
  checkSupplierOrPharmacy,
} from "../middleware/jwtAuthentication";

const router = express.Router();

router.post(
  "/",
  jwtAuth,
  checkSupplierOrPharmacy,
  productController.createProduct
);

router.post(
  "/bulk",
  jwtAuth,
  checkSupplierOrPharmacy,
  productController.createBulkProducts
);

router.get(
  "/vendor/:vendorOrgId",
  jwtAuth,
  productController.getProductsByVendor
);

router.put(
  "/:id",
  jwtAuth,
  checkSupplierOrAdmin,
  productController.updateProduct
);

router.delete(
  "/:id",
  jwtAuth,
  checkSupplierOrAdmin,
  productController.deleteProduct
);

export default router;
