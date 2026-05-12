import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { USER_ROLE, TUserRole } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';
import AppError from '../error/AppError';
import config from '../../config';
import { verifyToken } from '../utils/verifyJWT';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTHENTICATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Failed-auth rate limiting store (simple in-memory)
const authAttempts = new Map<string, { count: number; resetTime: number }>();

// Cleanup old rate limit entries every minute (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of authAttempts.entries()) {
      if (now > value.resetTime) {
        authAttempts.delete(key);
      }
    }
  }, 60000);
}

const getRateLimitKey = (req: Request): string => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const windowMs = 15 * 60 * 1000; // 15 minutes
  return `${clientIP}:${Math.floor(Date.now() / windowMs)}`;
};

const recordFailedAuthAttempt = (req: Request): boolean => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 30;
  const now = Date.now();
  const windowKey = getRateLimitKey(req);

  const attempts = authAttempts.get(windowKey) || { count: 0, resetTime: now + windowMs };

  if (attempts.count >= maxAttempts) {
    return false;
  }

  attempts.count++;
  authAttempts.set(windowKey, attempts);
  return true;
};

const clearFailedAuthAttempts = (req: Request): void => {
  authAttempts.delete(getRateLimitKey(req));
};

/**
 * Main authentication middleware with optional role-based access control
 */
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const headerToken = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken as string | undefined;
    let token = headerToken || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    if (!token) {
      if (!recordFailedAuthAttempt(req)) {
        throw new AppError(httpStatus.TOO_MANY_REQUESTS, 'Too many failed authentication attempts. Please try again later.');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized! Please provide a valid token.');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token || token.length < 10) {
      if (!recordFailedAuthAttempt(req)) {
        throw new AppError(httpStatus.TOO_MANY_REQUESTS, 'Too many failed authentication attempts. Please try again later.');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format!');
    }

    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string) as JwtPayload;
    } catch {
      if (!recordFailedAuthAttempt(req)) {
        throw new AppError(httpStatus.TOO_MANY_REQUESTS, 'Too many failed authentication attempts. Please try again later.');
      }
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
    }

    clearFailedAuthAttempts(req);

    const { role, email, _id, iat, exp } = decoded;

    const currentTime = Math.floor(Date.now() / 1000);
    if (exp && exp < currentTime) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired!');
    }

    let user = null;
    if (_id) {
      user = await User.findById(_id).select('+password');
    } else if (email) {
      user = await User.isUserExistsByEmail(email);
    }
    
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist!');
    }

    if (user?.status === 'BLOCKED') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked!');
    }

    if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Password has been changed. Please login again!');
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource!');
    }

    req.user = {
      ...decoded,
      _id: user._id?.toString() || '',
      id: user._id?.toString() || '',
      email: decoded.email,
      role: decoded.role,
      status: user.status,
      emailVerified: user.emailVerified,
      name: user.name,
      phone: user.phone,
    };

    next();
  });
};

/**
 * Optional authentication middleware
 */
export const optionalAuth = () => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const headerToken = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken as string | undefined;
    let token = headerToken || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    if (!token) {
      return next();
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    try {
      const decoded = verifyToken(token, config.jwt_access_secret as string) as JwtPayload;
      const { email, _id, iat } = decoded;

      let user = null;
      if (_id) {
        user = await User.findById(_id).select('+password');
      } else if (email) {
        user = await User.isUserExistsByEmail(email);
      }

      if (!user) return next();
      if (user?.status === 'BLOCKED') return next();

      if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
        return next();
      }

      req.user = {
        ...decoded,
        _id: user._id?.toString() || '',
        id: user._id?.toString() || '',
        email: decoded.email,
        role: decoded.role,
        status: user.status,
        emailVerified: user.emailVerified,
        name: user.name,
        phone: user.phone,
      };
    } catch (error) {
      return next();
    }
    next();
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// PRE-CONFIGURED AUTH MIDDLEWARES
// ─────────────────────────────────────────────────────────────────────────────

/** Any authenticated user */
export const requireAuth = auth();

/** Admin only */
export const requireAdmin = auth(USER_ROLE.ADMIN);

/** Admin or Editor */
export const requireEditor = auth(USER_ROLE.ADMIN, USER_ROLE.EDITOR);

/**
 * Middleware to check if user owns the resource or is admin
 */
export const requireOwnershipOrAdmin = (userIdField: string = 'userId') => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.params[userIdField] || req.body[userIdField] || req.query[userIdField];

    if (!userId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User ID not found in request');
    }

    if (req.user?.role === USER_ROLE.ADMIN || req.user?._id === userId) {
      return next();
    }

    throw new AppError(httpStatus.FORBIDDEN, 'You can only access your own resources!');
  });
};

/**
 * Middleware to check email verification
 */
export const requireEmailVerification = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user?.emailVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'Email verification required!');
  }
  next();
});

export default auth;