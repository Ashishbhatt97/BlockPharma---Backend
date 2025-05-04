import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import sendResponse from "../helper/responseHelper";
import prisma from "../config/db.config";
require("dotenv").config();

const SECRET = process.env.SECRET_KEY;

export interface JwtPayload {
  email: string;
  id: string;
  role: string;
  iat: number;
  exp: number;
}

const tokenGenerator = (payload: {}) => {
  let result = jwt.sign(payload, `${process.env.SECRET_KEY}`, {
    expiresIn: "30d",
  });

  return result;
};

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export interface AddressType {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  userId: string;
}

export interface VendorOrganizationSchemaType {
  organizationName: string;
  organizationType: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationEmail: string;
  organizationWebsite: string;
}

// Extend the Request interface to include `user`
export interface CustomRequest extends Request {
  user?: JwtPayload;
  address?: AddressType;
  organization?: VendorOrganizationSchemaType;
}
const jwtAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.header("Authorization")?.split(" ")[1];

  if (!authToken) {
    return sendResponse(res, 401, { message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(authToken, SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    return sendResponse(res, 401, { message: "Invalid or expired token" });
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return sendResponse(res, 401, { error: "Unauthorized" });
      }

      // Check if user has one of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return sendResponse(res, 403, {
          error: `Forbidden - Requires role: ${allowedRoles.join(" or ")}`,
        });
      }

      // For supplier-specific actions, verify ownership if vendorOrgId is involved
      if (
        req.user.role === "SUPPLIER" &&
        (req.params.vendorOrgId || req.body.vendorOrgId)
      ) {
        const vendorOrgId = req.params.vendorOrgId || req.body.vendorOrgId;
        const vendorOrg = await prisma.vendorOrganization.findFirst({
          where: {
            id: vendorOrgId,
            ownerId: req.user.id,
          },
        });

        if (!vendorOrg) {
          return sendResponse(res, 403, {
            error: "Forbidden - You don't own this vendor organization",
          });
        }
      }

      next();
    } catch (error) {
      console.error("Role check error:", error);
      return sendResponse(res, 500, { error: "Internal server error" });
    }
  };
};

// Specific role checkers for convenience
export const checkSupplier = checkRole(["SUPPLIER"]);
export const checkAdmin = checkRole(["ADMIN"]);
export const checkSupplierOrAdmin = checkRole(["SUPPLIER", "ADMIN"]);
export const checkPharmacy = checkRole(["PHARMACY"]);
export { jwtAuth, tokenGenerator };
