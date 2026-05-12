// ============================================================================
// AUTH CONTROLLER - Refactored with BaseController
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/BaseController';
import { catchAsync } from '../../../shared/utils/catchAsync.util';
import httpStatus from 'http-status';
import config from '../../../config';
import { AuthServices } from './auth.services';

const DEFAULT_REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const parseJwtDurationToMs = (value?: string): number => {
  if (!value) {
    return DEFAULT_REFRESH_COOKIE_MAX_AGE_MS;
  }

  const duration = value.trim();
  const match = duration.match(/^(\d+)\s*([smhd])$/i);

  if (!match) {
    return DEFAULT_REFRESH_COOKIE_MAX_AGE_MS;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return DEFAULT_REFRESH_COOKIE_MAX_AGE_MS;
  }
};

const REFRESH_COOKIE_MAX_AGE_MS = parseJwtDurationToMs(config.jwt_refresh_expires_in);
const ACCESS_COOKIE_MAX_AGE_MS = parseJwtDurationToMs(config.jwt_access_expires_in);

const BASE_COOKIE_OPTIONS = {
  secure: config.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict' as const,
};

/**
 * AuthController Class
 * Extends BaseController for consistent response handling
 */
class AuthController extends BaseController {
  
  // Blacklist for revoked tokens (in production, use Redis or database)
  private tokenBlacklist = new Set<string>();

  // ========================================================================
  // REGISTER
  // ========================================================================

  registerUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await AuthServices.registerUser(req.body);
    const { refreshToken, accessToken } = result;

    // Set secure HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: ACCESS_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refreshToken', refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    return this.sendCreated(
      res,
      {
        user: result.user,
      },
      'User registered successfully! Please check your email to verify your account.'
    );
  });

  // ========================================================================
  // LOGIN
  // ========================================================================

  loginUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    // Set secure HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: ACCESS_COOKIE_MAX_AGE_MS,
    });
    res.cookie('refreshToken', refreshToken, {
      ...BASE_COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    return this.sendSuccess(
      res,
      {
        user: result.user,
      },
      'User logged in successfully!'
    );
  });

  // ========================================================================
  // LOGOUT
  // ========================================================================

  logout = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const cookieToken = req.cookies?.accessToken as string | undefined;
    const token = headerToken || cookieToken;

    // Add token to blacklist if it exists
    if (token) {
      this.tokenBlacklist.add(token);
    }

    // Clear cookies
    res.clearCookie('accessToken', BASE_COOKIE_OPTIONS);
    res.clearCookie('refreshToken', BASE_COOKIE_OPTIONS);

    return this.sendSuccess(res, null, 'Logged out successfully!');
  });

  // ========================================================================
  // CHANGE PASSWORD
  // ========================================================================

  changePassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { ...passwordData } = req.body;

    if (!req.user) {
      return this.sendError(res, 'User not authenticated', httpStatus.UNAUTHORIZED);
    }

    await AuthServices.changePassword(req.user, passwordData);
    return this.sendSuccess(res, null, 'Password updated successfully!');
  });

  // ========================================================================
  // REFRESH TOKEN
  // ========================================================================

  refreshToken = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return this.sendError(res, 'Refresh token not found', httpStatus.UNAUTHORIZED);
    }

    const result = await AuthServices.refreshToken(token);

    if (result?.accessToken) {
      res.cookie('accessToken', result.accessToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: ACCESS_COOKIE_MAX_AGE_MS,
      });
    }

    if ((result as { refreshToken?: string })?.refreshToken) {
      res.cookie('refreshToken', (result as { refreshToken?: string }).refreshToken as string, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      });
    }

    return this.sendSuccess(res, { refreshed: true }, 'Access token retrieved successfully!');
  });

  // ========================================================================
  // EMAIL VERIFICATION
  // ========================================================================

  verifyEmail = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { token } = req.body;
    const result = await AuthServices.verifyEmail(token);

    return this.sendSuccess(res, result.user, result.message);
  });

  resendVerificationEmail = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;
    const result = await AuthServices.resendVerificationEmail(email);

    return this.sendSuccess(res, null, result.message);
  });

  // ========================================================================
  // PROFILE
  // ========================================================================

  getMyProfile = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      return this.sendError(res, 'User ID not found in token', httpStatus.UNAUTHORIZED);
    }

    const result = await AuthServices.getMyProfile(userId);
    return this.sendSuccess(res, result, 'User profile retrieved successfully');
  });

  // ========================================================================
  // PASSWORD RESET
  // ========================================================================

  forgotPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await AuthServices.forgotPassword(req.body);
    return this.sendSuccess(res, null, result.message);
  });

  resetPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await AuthServices.resetPassword(req.body);
    return this.sendSuccess(res, null, result.message);
  });

  // ========================================================================
  // HELPER: Check if token is blacklisted
  // ========================================================================

  isTokenBlacklisted = (token: string): boolean => {
    return this.tokenBlacklist.has(token);
  };

  // Constructor: Setup periodic cleanup
  constructor() {
    super();
    
    // Clean up blacklist periodically (skip in test mode)
    if (process.env.NODE_ENV !== 'test') {
      setInterval(() => {
        if (this.tokenBlacklist.size > 10000) {
          this.tokenBlacklist.clear();
        }
      }, 3600000); // 1 hour
    }
  }
}

// ========================================================================
// EXPORT INSTANCE
// ========================================================================

const authController = new AuthController();

export const AuthControllers = {
  registerUser: authController.registerUser,
  loginUser: authController.loginUser,
  logout: authController.logout,
  changePassword: authController.changePassword,
  refreshToken: authController.refreshToken,
  verifyEmail: authController.verifyEmail,
  resendVerificationEmail: authController.resendVerificationEmail,
  getMyProfile: authController.getMyProfile,
  forgotPassword: authController.forgotPassword,
  resetPassword: authController.resetPassword,
};

// Export token blacklist checker
export const isTokenBlacklisted = authController.isTokenBlacklisted;