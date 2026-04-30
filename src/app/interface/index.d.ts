import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        _id: string;
        email: string;
        role: string;
        status?: string;
        emailVerified?: boolean;
        name?: string;
        phone?: string;
      };
    }
  }
}