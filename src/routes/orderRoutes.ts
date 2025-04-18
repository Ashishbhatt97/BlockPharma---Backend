import express, { Router } from "express";
import orderController from "../controllers/controllers";
import { jwtAuth } from "../middleware/jwtAuthentication";

const router: Router = express.Router();

// router.route("/createOrder").post(jwtAuth, orderController.createOrder);
// router.route("/getOrders").get(jwtAuth, orderController.getOrders);
// router.route("/getOrderById").get(jwtAuth, orderController.getOrderById);
// router.route("/updateOrder").put(jwtAuth, orderController.updateOrder);
// router.route("/cancelOrder").put(jwtAuth, orderController.cancelOrder);
// router
//   .route("/getAllUserOrders")
//   .get(jwtAuth, orderController.getAllUserOrders);
// router.route("/delete").delete(jwtAuth, orderController.deleteOrder);

export default router;
