import express, { Router } from "express";
import pharmacistController from "../controllers/controllers";
import { jwtAuth } from "../middleware/middlewares";
import upload from "../config/upload.config";

const router: Router = express.Router();

// router.post("/add", jwtAuth, pharmacistController.addPharmacist);
// router.get("/get", jwtAuth, pharmacistController.getPharmacistById);
// router.get("/getall", jwtAuth, pharmacistController.getAllPharmacists);
// router.delete("/delete", jwtAuth, pharmacistController.deletePharmacist);

//Pharmacy Outlet Routes
router.post("/outlet/add", jwtAuth, pharmacistController.addPharmacyOutlet);
router.get("/outlet/get", jwtAuth, pharmacistController.getPharmacyOutletById);
router.get(
  "/outlet/getall",
  jwtAuth,
  pharmacistController.getAllPharmacyOutlets
);
router.delete(
  "/outlet/delete",
  jwtAuth,
  pharmacistController.deletePharmacyOutlet
);
router.put(
  "/outlet/update",
  jwtAuth,
  pharmacistController.updatePharmacyOutlet
);

export default router;
