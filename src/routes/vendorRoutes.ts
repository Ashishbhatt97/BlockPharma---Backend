import express, { Router } from "express";
import { jwtAuth } from "../middleware/middlewares";
import vendorController from "../controllers/controllers";

const router: Router = express.Router();

// Vendor routes
router.post("/add", jwtAuth, vendorController.addVendor);
router.get("/get", jwtAuth, vendorController.getVendor);
router.delete("/delete", jwtAuth, vendorController.deleteVendor);

export default router;
