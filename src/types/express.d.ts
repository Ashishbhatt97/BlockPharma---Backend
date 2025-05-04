import { JwtPayload } from "../../middleware/jwtAuth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
