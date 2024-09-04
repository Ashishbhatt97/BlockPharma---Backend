import express, { Router } from "express";
import userController from "../controllers/controllers";
import { jwtAuth } from "../middleware/middlewares";
import upload from "../config/upload.config";

const router: Router = express.Router();

// user routes
router.post(
  "/register",
  upload.single("profilePic"),
  userController.userRegister
);
router.post("/login", userController.userLogin);
router
  .route("/update")
  .put(jwtAuth, upload.single("profilePic"), userController.updateUserDetails);
router.route("/upgradeUser").put(jwtAuth, userController.upgradeUser);
router.route("/changepassword").put(jwtAuth, userController.changePassword);
router.delete("/delete", jwtAuth, userController.deleteUser);
router.get("/getdetails", jwtAuth, userController.getUserById);

//Address Routes
router.post("/addAddress", jwtAuth, userController.addAddress);
router.put("/updateAddress", jwtAuth, userController.updateAddress);

export default router;
