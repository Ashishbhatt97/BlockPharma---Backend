import express from "express";
import orderController from "../controllers/orderController";
import {
  jwtAuth,
  checkPharmacy,
  checkSupplier,
} from "../middleware/jwtAuthentication";

const router = express.Router();

// Pharmacy creates an order (with blockchain tx hash)
router.post("/", jwtAuth, checkPharmacy, orderController.createOrder);
router.get(
  "/all",
  jwtAuth,
  checkPharmacy,
  orderController.getAllPharmacyOrders
);

// Get orders for pharmacy
router.get(
  "/pharmacy/:pharmacyOutletId",
  jwtAuth,
  checkPharmacy,
  orderController.getPharmacyOrders
);

// Get pending orders for vendor
router.get(
  "/vendor/pending",
  jwtAuth,
  checkSupplier,
  orderController.getVendorPendingOrders
);

// Update order status (vendor)
router.put(
  "/:id/status",
  jwtAuth,
  checkSupplier,
  orderController.updateOrderStatus
);

// Get order details
router.get("/:id", jwtAuth, orderController.getOrderDetails);
router.get("/vendor/:id", jwtAuth, orderController.getAllSupplierOrders);

export default router;
