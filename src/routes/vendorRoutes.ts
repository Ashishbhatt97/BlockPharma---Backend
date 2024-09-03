import express, { Router } from "express";
import { jwtAuth } from "../middleware/middlewares";
import vendorController from "../controllers/controllers";

const router: Router = express.Router();

// Vendor routes
router.post("/addVendor", jwtAuth, vendorController.addVendor);

export default router;
