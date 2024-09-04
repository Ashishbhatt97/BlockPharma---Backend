import userController from "./userController";
import vendorController from "./vendorController";
import pharmacistController from "./pharmacistController";

export default {
  ...userController,
  ...vendorController,
  ...pharmacistController,
};
