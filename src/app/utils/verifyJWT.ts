import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import AppError from '../error/AppError';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JWT UTILITIES - E-commerce Platform
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// JWT PAYLOAD TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface JwtTokenPayload {
  _id?: string;
  email: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  vendorProfile?: string;
  vendorManagerProfile?: string;
  resellerProfile?: string;
  purchaseManProfile?: string;
  deliveryManProfile?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TOKEN
// ─────────────────────────────────────────────────────────────────────────────

export const createToken = (
  jwtPayload: Partial<JwtTokenPayload> | Record<string, unknown>,
  secret: string,
  expiresIn: string | number
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(jwtPayload, secret as jwt.Secret, options);
};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY TOKEN
// ─────────────────────────────────────────────────────────────────────────────

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError(401, 'You are not authorized!');
  }
};