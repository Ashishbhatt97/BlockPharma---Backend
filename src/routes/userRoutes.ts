import express, { Router } from "express";
import userController from "../controllers/controllers";
import { jwtAuth } from "../middleware/middlewares";

const router: Router = express.Router();

// Route to handle user registration
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.route("/update").put(jwtAuth as any, userController.updateUserDetails);
router.route("/upgradeUser").put(jwtAuth as any, userController.upgradeUser);
router
  .route("/changepassword")
  .put(jwtAuth as any, userController.changePassword);
router.delete("/delete", jwtAuth as any, userController.deleteUser);
router.get("/getdetails", jwtAuth as any, userController.getUserById);
router.post("/addAddress", jwtAuth as any, userController.addAddress);

export default router;
