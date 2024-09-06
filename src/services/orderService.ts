import { OrderSchemaType } from "../models/Orders";

const orderDataAccess = require("../dataAccess/orderDataAccess");

const createOrderService = async (validatedOrder: OrderSchemaType) => {
  const order = orderDataAccess.createOrder(validatedOrder);

  return {
    status: 201,
    message: "Order created successfully",
    data: order,
  };
};

export default { createOrderService };
