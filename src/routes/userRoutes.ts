import express from "express";
import userController from "../controllers/controllers";

const router = express.Router();

// Route to handle user registration
router.post("/register", userController.userRegister);

export default router;
