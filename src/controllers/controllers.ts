import userController from "./userController";
import vendorController from "./vendorController";
import pharmacistController from "./pharmacistController";
// import orderController from "./orderController";

export default {
  ...userController,
  ...vendorController,
  ...pharmacistController,
  // ...orderController,
};
