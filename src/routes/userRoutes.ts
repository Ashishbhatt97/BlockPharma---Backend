import express, { Router } from "express";
import userController from "../controllers/controllers";
import { jwtAuth } from "../middleware/middlewares";
import upload from "../config/upload.config";

const router: Router = express.Router();

// user routes
router.get("/me", jwtAuth, userController.meQuery);
router.post(
  "/register",
  upload.single("profilePic"),
  userController.userRegister
);
router.post("/login", userController.userLogin);
router
  .route("/update")
  .put(jwtAuth, upload.single("profilePic"), userController.updateUserDetails);
router.route("/upgrade-user").put(jwtAuth, userController.upgradeUser);
router.route("/change-password").put(jwtAuth, userController.changePassword);
router.delete("/delete", jwtAuth, userController.deleteUser);
router.get("/get-details", jwtAuth, userController.getUserById);
router.put("/complete-profile", jwtAuth, userController.completeProfile);
// router.get("/getUser/:id", jwtAuth, userController.getUser);
//Address Routes
router.post("/add-address", jwtAuth, userController.addAddress);
router.put("/update-address", jwtAuth, userController.updateAddress);

export default router;
