import express, { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuthentication";
import orderController from "../controllers/controllers";

const router: Router = express.Router();

router.route("/createOrder").post(jwtAuth, orderController.createOrder);
router.route("/getOrders").get(jwtAuth, orderController.getOrders);
router.route("/getOrderById").get(jwtAuth, orderController.getOrderById);
router.route("/updateOrder").put(jwtAuth, orderController.updateOrder);
router.route("/cancelOrder").put(jwtAuth, orderController.cancelOrder);
// router.route("/deleteOrder").post(jwtAuth, orderController.deleteOrder);

export default router;
