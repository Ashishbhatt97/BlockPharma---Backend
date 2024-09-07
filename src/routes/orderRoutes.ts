import express, { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuthentication";
import orderController from "../controllers/controllers";

const router: Router = express.Router();

router.route("/createOrder").post(jwtAuth, orderController.createOrder);
router.route("/getOrders").get(jwtAuth, orderController.getOrders);
// router.route("/updateOrder").post(jwtAuth, orderController.updateOrder);
// router.route("/deleteOrder").post(jwtAuth, orderController.deleteOrder);

export default router;
