import express, { Router } from "express";
import { jwtAuth } from "../middleware/middlewares";
import vendorController from "../controllers/controllers";

const router: Router = express.Router();

router.post("/add", jwtAuth, vendorController.addVendorOrganization);
router.put("/update/:id", jwtAuth, vendorController.updateOrganization);
router.get("/get", jwtAuth, vendorController.getOrganization);
router.get("/getAll", jwtAuth, vendorController.getAllVendorOrganizations);
router.delete("/delete/:id", jwtAuth, vendorController.deleteOrganization);

export default router;
