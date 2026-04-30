import bcryptjs from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { USER_ROLE, USER_STATUS, GENDER } from './user.constant';
import { IUserModel, TUser } from './user.interface';
import config from '../../../config';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USER SCHEMA
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const userSchema = new Schema<TUser, IUserModel>(
  {
    // ═══════════════════════════════════════════════════════════════════════
    // CORE FIELDS
    // ═══════════════════════════════════════════════════════════════════════
    
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please provide a valid email address',
      ],
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
      match: [/^[+]?[\d\s-]{10,15}$/, 'Please provide a valid phone number'],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // ROLE & STATUS
    // ═══════════════════════════════════════════════════════════════════════
    
    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLE),
        message: '{VALUE} is not a valid role',
      },
      default: USER_ROLE.USER,
      required: true,
    },
    
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: '{VALUE} is not a valid status',
      },
      default: USER_STATUS.PENDING,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // PROFILE INFORMATION
    // ═══════════════════════════════════════════════════════════════════════
    
    profilePhoto: {
      type: String,
      default: null,
    },
    
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    
    dateOfBirth: {
      type: Date,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // AUTHENTICATION & SECURITY
    // ═══════════════════════════════════════════════════════════════════════
    
    emailVerified: {
      type: Boolean,
      default: false,
    },
    
    emailVerificationToken: {
      type: String,
      select: false,
    },
    
    emailVerificationTokenExpires: {
      type: Date,
      select: false,
    },
    
    passwordResetToken: {
      type: String,
      select: false,
    },
    
    passwordResetTokenExpires: {
      type: Date,
      select: false,
    },
    
    passwordChangedAt: {
      type: Date,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SAVED ADDRESSES
    // ═══════════════════════════════════════════════════════════════════════
    
    savedAddresses: [{
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      area: { type: String },
      district: { type: String, required: true },
      city: { type: String, default: 'dhaka' },
      type: { 
        type: String, 
        enum: ['home', 'office'], 
        default: 'home' 
      },
      isDefault: { type: Boolean, default: false },
    }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.password = undefined;
        ret.emailVerificationToken = undefined;
        ret.passwordResetToken = undefined;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// userSchema.index({ email: 1 }); // Removed (unique: true already creates index)
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// Text index for search
userSchema.index({ name: 'text', email: 'text' });

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  // Normalize email
  if (this.isModified('email') && this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(
      this.password,
      Number(config.bcrypt_salt_rounds) || 12
    );
  }

  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// STATIC METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find user by email (case-insensitive) with password
 */
userSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<TUser | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

/**
 * Find user by phone number with password
 */
userSchema.statics.isUserExistsByPhone = async function (
  phone: string
): Promise<TUser | null> {
  // Normalize phone: remove spaces, dashes, and leading +88 or 0
  const normalizedPhone = phone.replace(/[\s-]/g, '').replace(/^(\+?88)?0?/, '');
  // Search for various phone formats
  return this.findOne({
    $or: [
      { phone: phone },
      { phone: normalizedPhone },
      { phone: `0${normalizedPhone}` },
      { phone: `+880${normalizedPhone}` },
    ]
  }).select('+password');
};

/**
 * Compare plain text password with hashed password
 */
userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
};

/**
 * Check if JWT was issued before password change
 */
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date | number,
  jwtIssuedAt: number
): boolean {
  if (!passwordChangedAt) return false;
  
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedAt;
};

// ─────────────────────────────────────────────────────────────────────────────
// VIRTUAL FIELDS
// ─────────────────────────────────────────────────────────────────────────────

// Virtual for full profile URL
userSchema.virtual('profilePhotoUrl').get(function () {
  if (this.profilePhoto) {
    if (this.profilePhoto.startsWith('http')) {
      return this.profilePhoto;
    }
    return `${config.BASE_URL}${this.profilePhoto}`;
  }
  return null;
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT MODEL
// ─────────────────────────────────────────────────────────────────────────────

export const User = model<TUser, IUserModel>('User', userSchema);