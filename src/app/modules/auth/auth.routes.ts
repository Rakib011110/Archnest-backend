import express from 'express';
import { requireAuth } from '../../middlewares/auth';
import { AuthControllers } from './auth.controller';

const router = express.Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTH ROUTES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Registration & Login
router.post('/register', AuthControllers.registerUser);
router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshToken);

// Email Verification
router.post('/verify-email', AuthControllers.verifyEmail);
router.post('/resend-verification', AuthControllers.resendVerificationEmail);

// Password Reset
router.post('/forgot-password', AuthControllers.forgotPassword);
router.post('/reset-password', AuthControllers.resetPassword);

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Logout
router.post('/logout', requireAuth, AuthControllers.logout);

// Change Password
router.post('/change-password', requireAuth, AuthControllers.changePassword);

// Get Current User Profile
router.get('/me', requireAuth, AuthControllers.getMyProfile);

export const AuthRoutes = router;