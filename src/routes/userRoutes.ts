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

export default router;
