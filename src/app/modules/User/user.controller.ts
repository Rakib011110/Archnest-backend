// ============================================================================
// USER CONTROLLER - Refactored with BaseController
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../../shared/base/BaseController';
import { catchAsync } from '../../../shared/utils/catchAsync.util';
import httpStatus from 'http-status';
import { UserServices } from './user.services';
import { TUserQuery } from './user.interface';

/**
 * UserController Class
 * Extends BaseController for consistent response handling
 */
class UserController extends BaseController {
  
  // ========================================================================
  // BASIC CRUD
  // ========================================================================

  createUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserServices.createUserIntoDB(req.body);
    return this.sendCreated(res, user, 'User created successfully');
  });

  getAllUsers = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query: TUserQuery = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      searchTerm: req.query.searchTerm as string,
      role: req.query.role as TUserQuery['role'],
      status: req.query.status as TUserQuery['status'],
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await UserServices.getAllUsersFromDb(query);

    return this.sendPaginated(
      res,
      result.data,
      result.pagination,
      'Users fetched successfully'
    );
  });

  getUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserServices.getAUserFromDb(req.params.id);
    return this.sendSuccess(res, user, 'User fetched successfully');
  });

  getMyProfile = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }

    const user = await UserServices.getAUserFromDb(userId);
    return this.sendSuccess(res, user, 'Profile fetched successfully');
  });

  updateUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await UserServices.updateUserInDb(req.params.id, req.body);
    
    return this.sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      'User updated successfully'
    );
  });

  deleteUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await UserServices.deleteUserFromDb(req.params.id);
    return this.sendSuccess(res, result, 'User deleted successfully');
  });

  // ========================================================================
  // PROFILE PHOTO
  // ========================================================================

  uploadProfilePhoto = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }

    if (!req.file) {
      return this.sendError(res, 'No file uploaded', httpStatus.BAD_REQUEST);
    }

    const updatedUser = await UserServices.uploadProfilePhoto(userId, req.file);

    return this.sendSuccess(
      res,
      {
        user: updatedUser,
        profilePhotoUrl: updatedUser.profilePhoto,
      },
      'Profile photo uploaded successfully'
    );
  });

  // ========================================================================
  // ADMIN OPERATIONS
  // ========================================================================

  updateUserStatus = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { status } = req.body;
    const user = await UserServices.updateUserStatus(req.params.id, status);
    
    return this.sendSuccess(
      res,
      user,
      `User ${status.toLowerCase()} successfully`
    );
  });

  updateUserRole = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const { role } = req.body;
    const user = await UserServices.updateUserRole(req.params.id, role);
    
    return this.sendSuccess(res, user, 'User role updated successfully');
  });

  getUserStats = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await UserServices.getUserStats();
    return this.sendSuccess(res, stats, 'User statistics fetched');
  });

  // ========================================================================
  // SAVED ADDRESSES
  // ========================================================================

  getSavedAddresses = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }
    const addresses = await UserServices.getSavedAddresses(userId);
    return this.sendSuccess(res, addresses, 'Addresses fetched successfully');
  });

  addSavedAddress = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }
    const addresses = await UserServices.addSavedAddress(userId, req.body);
    return this.sendCreated(res, addresses, 'Address added successfully');
  });

  updateSavedAddress = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }
    const addresses = await UserServices.updateSavedAddress(userId, addressId, req.body);
    return this.sendSuccess(res, addresses, 'Address updated successfully');
  });

  deleteSavedAddress = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }
    const addresses = await UserServices.deleteSavedAddress(userId, addressId);
    return this.sendSuccess(res, addresses, 'Address deleted successfully');
  });

  setDefaultAddress = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id;
    const { addressId } = req.params;
    if (!userId) {
      return this.sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
    }
    const addresses = await UserServices.setDefaultAddress(userId, addressId);
    return this.sendSuccess(res, addresses, 'Default address updated');
  });
}

// ========================================================================
// EXPORT INSTANCE
// ========================================================================

const userController = new UserController();

export const UserControllers = {
  createUser: userController.createUser,
  getAllUsers: userController.getAllUsers,
  getUser: userController.getUser,
  getMyProfile: userController.getMyProfile,
  updateUser: userController.updateUser,
  deleteUser: userController.deleteUser,

  uploadProfilePhoto: userController.uploadProfilePhoto,

  updateUserStatus: userController.updateUserStatus,
  updateUserRole: userController.updateUserRole,
  getUserStats: userController.getUserStats,

  // Saved Addresses
  getSavedAddresses: userController.getSavedAddresses,
  addSavedAddress: userController.addSavedAddress,
  updateSavedAddress: userController.updateSavedAddress,
  deleteSavedAddress: userController.deleteSavedAddress,
  setDefaultAddress: userController.setDefaultAddress,
};
