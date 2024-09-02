import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const SECRET = process.env.SECRET_KEY;

export interface JwtPayload {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export interface AddressType {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  userId: string;
}

// Extend the Request interface to include `user`
export interface CustomRequest extends Request {
  user?: JwtPayload;
  address?: AddressType;
}

const tokenGenerator = (payload: {}) => {
  let result = jwt.sign(payload, `${process.env.SECRET_KEY}`, {
    expiresIn: "30d",
  });

  result = "Bearer " + result;
  return result;
};

const jwtAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.header("Authorization")?.split(" ")[1];

  try {
    if (!authToken || authToken === undefined) {
      return res.json({
        status: 401,
        message: "Unauthorized",
      });
    }

    if (SECRET) {
      jwt.verify(authToken, `${process.env.SECRET_KEY}`, (err, payload) => {
        if (err) {
          return res.json({
            status: 401,
            message: "Unauthorized",
          });
        } else {
          req.user = payload as JwtPayload;
          next(); // Proceed to the next middleware or route handler
        }
      });
    }
  } catch (err) {
    return res.json({
      status: 401,
      message: "Invalid token",
    });
  }
};

export { jwtAuth, tokenGenerator };
