// ============================================================================
// USER SERVICE - Refactored with BaseService
// ============================================================================

import { BaseService } from '../../../shared/base/BaseService';
import AppError from '../../../shared/errors/AppError';
import { User } from './user.model';
import { TUser, TUserQuery, TUserUpdatePayload } from './user.interface';
import { createToken } from '../../utils/verifyJWT';
import config from '../../../config';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { calculatePagination, calculateSkip } from '../../../shared/utils/pagination.util';

/**
 * UserService Class
 * Extends BaseService for common CRUD operations
 */
class UserService extends BaseService<any> {
  constructor() {
    super(User as any);
  }

  // ========================================================================
  // OVERRIDE: Custom getAllWithPagination with search
  // ========================================================================

  async getAllUsers(query?: TUserQuery) {
    const {
      page = 1,
      limit = 10,
      searchTerm,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query || {};

    const skip = calculateSkip(page, limit);
    const filter: Record<string, unknown> = {};

    // Search by name or email
    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (role) filter.role = role;
    if (status) filter.status = status;

    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      this.model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password'),
      this.model.countDocuments(filter)
    ]);

    const pagination = calculatePagination({ page, limit }, total);

    return {
      data: users,
      pagination,
    };
  }

  // ========================================================================
  // OVERRIDE: Custom findById with password exclusion
  // ========================================================================

  async getUserById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    }

    const user = await this.findById(id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Remove password from response
    const userObj = (user as any).toJSON();
    delete (userObj as any).password;

    return userObj;
  }

  // ========================================================================
  // CUSTOM: Update user with JWT token generation
  // ========================================================================

  async updateUserWithToken(id: string, payload: TUserUpdatePayload) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    }

    const user = await this.update(id, payload as any);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Generate new JWT with updated user data
    const jwtPayload = {
      _id: user._id?.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    // Remove password
    const userObj = (user as any).toJSON();
    delete (userObj as any).password;

    return { user: userObj, accessToken };
  }

  // ========================================================================
  // PROFILE PHOTO
  // ========================================================================

  async uploadProfilePhoto(userId: string, file: Express.Multer.File) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    }

    const photoUrl = `/uploads/profilephoto/${file.filename}`;

    const updatedUser = await this.update(userId, { profilePhoto: photoUrl } as any);

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Remove password
    const userObj = updatedUser.toJSON();
    delete (userObj as any).password;

    return userObj;
  }

  // ========================================================================
  // ADMIN OPERATIONS
  // ========================================================================

  async updateUserStatus(
    userId: string,
    status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED'
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    }

    const user = await this.update(userId, { status } as any);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Remove password
    const userObj = (user as any).toJSON();
    delete (userObj as any).password;

    return userObj;
  }

  async updateUserRole(
    userId: string,
    role: 'ADMIN' | 'USER'
  ) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
    }

    const user = await this.update(userId, { role } as any);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Remove password
    const userObj = (user as any).toJSON();
    delete (userObj as any).password;

    return userObj;
  }

  // ========================================================================
  // STATISTICS
  // ========================================================================

  async getUserStats() {
    const stats = await this.model.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = await this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await this.count();
    const newUsersToday = await this.model.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    return {
      totalUsers,
      newUsersToday,
      byRole: stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      byStatus: statusStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // ========================================================================
  // SAVED ADDRESSES OPERATIONS
  // ========================================================================

  async getSavedAddresses(userId: string) {
    const user = await this.model.findById(userId).select('savedAddresses');
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user.savedAddresses || [];
  }

  async addSavedAddress(userId: string, addressData: {
    name: string;
    phone: string;
    address: string;
    area?: string;
    district: string;
    city?: string;
    type?: 'home' | 'office';
  }) {
    const user = await this.model.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // If this is the first address, make it default
    const isDefault = !user.savedAddresses || user.savedAddresses.length === 0;

    const newAddress = {
      ...addressData,
      city: addressData.city || 'dhaka',
      type: addressData.type || 'home',
      isDefault,
    };

    const updatedUser = await this.model.findByIdAndUpdate(
      userId,
      { $push: { savedAddresses: newAddress } },
      { new: true }
    ).select('savedAddresses');

    return updatedUser?.savedAddresses;
  }

  async updateSavedAddress(userId: string, addressId: string, addressData: {
    name?: string;
    phone?: string;
    address?: string;
    area?: string;
    district?: string;
    city?: string;
    type?: 'home' | 'office';
  }) {
    const updateFields: Record<string, unknown> = {};
    Object.entries(addressData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields[`savedAddresses.$.${key}`] = value;
      }
    });

    const updatedUser = await this.model.findOneAndUpdate(
      { _id: userId, 'savedAddresses._id': addressId },
      { $set: updateFields },
      { new: true }
    ).select('savedAddresses');

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Address not found');
    }

    return updatedUser.savedAddresses;
  }

  async deleteSavedAddress(userId: string, addressId: string) {
    const updatedUser = await this.model.findByIdAndUpdate(
      userId,
      { $pull: { savedAddresses: { _id: addressId } } },
      { new: true }
    ).select('savedAddresses');

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return updatedUser.savedAddresses;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // First, set all addresses to non-default
    await this.model.findByIdAndUpdate(
      userId,
      { $set: { 'savedAddresses.$[].isDefault': false } }
    );

    // Then set the selected address as default
    const updatedUser = await this.model.findOneAndUpdate(
      { _id: userId, 'savedAddresses._id': addressId },
      { $set: { 'savedAddresses.$.isDefault': true } },
      { new: true }
    ).select('savedAddresses');

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Address not found');
    }

    return updatedUser.savedAddresses;
  }
}

// ========================================================================
// EXPORT INSTANCE
// ========================================================================

export const userService = new UserService();

// Export for backward compatibility
export const UserServices = {
  createUserIntoDB: (payload: Partial<TUser>) => userService.create(payload),
  getAllUsersFromDb: (query?: TUserQuery) => userService.getAllUsers(query),
  getAUserFromDb: (id: string) => userService.getUserById(id),
  updateUserInDb: (id: string, payload: TUserUpdatePayload) => 
    userService.updateUserWithToken(id, payload),
  deleteUserFromDb: (id: string) => userService.delete(id),

  // Profile Photo
  uploadProfilePhoto: (userId: string, file: Express.Multer.File) =>
    userService.uploadProfilePhoto(userId, file),

  // Admin
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED') =>
    userService.updateUserStatus(userId, status),
  updateUserRole: (userId: string, role: 'ADMIN' | 'USER') =>
    userService.updateUserRole(userId, role),
  getUserStats: () => userService.getUserStats(),

  // Saved Addresses
  getSavedAddresses: (userId: string) => userService.getSavedAddresses(userId),
  addSavedAddress: (userId: string, addressData: {
    name: string;
    phone: string;
    address: string;
    area?: string;
    district: string;
    city?: string;
    type?: 'home' | 'office';
  }) => userService.addSavedAddress(userId, addressData),
  updateSavedAddress: (userId: string, addressId: string, addressData: {
    name?: string;
    phone?: string;
    address?: string;
    area?: string;
    district?: string;
    city?: string;
    type?: 'home' | 'office';
  }) => userService.updateSavedAddress(userId, addressId, addressData),
  deleteSavedAddress: (userId: string, addressId: string) =>
    userService.deleteSavedAddress(userId, addressId),
  setDefaultAddress: (userId: string, addressId: string) =>
    userService.setDefaultAddress(userId, addressId),
};
