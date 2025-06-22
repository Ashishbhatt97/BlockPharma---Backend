import express from "express";
import inventoryController from "../controllers/inventoryController";
import { jwtAuth } from "../middleware/jwtAuthentication";

const router = express.Router();

router.post("/", jwtAuth, inventoryController.addInventory);
router.get("/:pharmacyOutletId", jwtAuth, inventoryController.getInventory);
router.put("/:id", jwtAuth, inventoryController.updateInventory);
router.delete("/:id", jwtAuth, inventoryController.deleteInventory);

export default router;
