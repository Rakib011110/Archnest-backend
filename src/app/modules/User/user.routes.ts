import express from 'express';
import { UserControllers } from './user.controller';
import { uploadProfilePhoto } from '../../../lib/multer/multer';
import { requireAuth, requireAdmin } from '../../middlewares/auth';

const router = express.Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USER ROUTES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Get single user by ID
router.get('/:id', UserControllers.getUser);

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTES - CURRENT USER
// ─────────────────────────────────────────────────────────────────────────────

// Get current user profile
router.get('/me/profile', requireAuth, UserControllers.getMyProfile);

// Update current user profile
router.put('/me/profile', requireAuth, UserControllers.updateUser);

// Upload profile photo
router.post(
  '/me/profile-photo',
  requireAuth,
  uploadProfilePhoto.single('profilePhoto'),
  UserControllers.uploadProfilePhoto
);

// ─────────────────────────────────────────────────────────────────────────────
// SAVED ADDRESSES ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Get all saved addresses
router.get('/me/addresses', requireAuth, UserControllers.getSavedAddresses);

// Add new address
router.post('/me/addresses', requireAuth, UserControllers.addSavedAddress);

// Update address
router.put('/me/addresses/:addressId', requireAuth, UserControllers.updateSavedAddress);

// Delete address
router.delete('/me/addresses/:addressId', requireAuth, UserControllers.deleteSavedAddress);

// Set default address
router.patch('/me/addresses/:addressId/default', requireAuth, UserControllers.setDefaultAddress);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// Get all users (admin only)
router.get('/', requireAdmin, UserControllers.getAllUsers);

// Get user statistics (admin only)
router.get('/admin/stats', requireAdmin, UserControllers.getUserStats);

// Create user (admin only)
router.post('/', requireAdmin, UserControllers.createUser);

// Update user (admin only)
router.put('/:id', requireAdmin, UserControllers.updateUser);

// Update user status (admin only) - block/unblock
router.patch('/:id/status', requireAdmin, UserControllers.updateUserStatus);

// Update user role (admin only)
router.patch('/:id/role', requireAdmin, UserControllers.updateUserRole);

// Delete user (admin only)
router.delete('/:id', requireAdmin, UserControllers.deleteUser);

// Upload profile photo for any user (admin only)
router.post(
  '/:id/profile-photo',
  requireAdmin,
  uploadProfilePhoto.single('profilePhoto'),
  UserControllers.uploadProfilePhoto
);

export const UserRoutes = router;
