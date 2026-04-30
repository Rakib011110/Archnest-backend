import { Model, Types } from 'mongoose';
import { TUserRole, TUserStatus, TGender } from './user.constant';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USER INTERFACES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESS INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface TAddress {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  address: string;
  area?: string;
  district: string;
  city?: string;
  type: 'home' | 'office';
  isDefault: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN USER INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface TUser {
  _id?: Types.ObjectId;
  
  // Core Fields
  name: string;
  email?: string; // Optional - can login with phone only
  password: string;
  phone: string; // Required - primary identifier
  
  // Role & Status
  role: TUserRole;
  status: TUserStatus;
  
  // Profile
  profilePhoto?: string;
  gender?: TGender;
  dateOfBirth?: Date;
  
  // Saved Addresses
  savedAddresses?: TAddress[];
  
  // Authentication
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  passwordChangedAt?: Date;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER MODEL STATIC METHODS
// ─────────────────────────────────────────────────────────────────────────────

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isUserExistsByPhone(phone: string): Promise<TUser | null>;
  isPasswordMatched(plainPassword: string, hashedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(passwordChangedAt: Date | number, jwtIssuedAt: number): boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH RELATED INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface TRegisterUser {
  name: string;
  email?: string; // Optional
  password: string;
  phone: string;  // Required
  role?: TUserRole;
}

export interface TLoginUser {
  email?: string;  // Login with email OR phone
  phone?: string;  // Login with phone OR email
  password: string;
}

export interface TChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface TForgotPassword {
  email: string;
}

export interface TResetPassword {
  token: string;
  newPassword: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// JWT PAYLOAD
// ─────────────────────────────────────────────────────────────────────────────

export interface TJwtPayload {
  _id: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  emailVerified: boolean;
  iat?: number;
  exp?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUERY INTERFACES (for filtering, pagination)
// ─────────────────────────────────────────────────────────────────────────────

export interface TUserQuery {
  searchTerm?: string;
  role?: TUserRole;
  status?: TUserStatus;
  emailVerified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TUserUpdatePayload {
  name?: string;
  phone?: string;
  profilePhoto?: string;
  gender?: TGender;
  dateOfBirth?: Date;
}