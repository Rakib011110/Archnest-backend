import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { createToken } from '../../utils/verifyJWT';
import { USER_ROLE, USER_STATUS, EMAIL_VERIFICATION_TOKEN_EXPIRY, PASSWORD_RESET_TOKEN_EXPIRY } from '../User/user.constant';
import { TRegisterUser, TLoginUser, TForgotPassword, TResetPassword, TJwtPayload } from '../User/user.interface';
import AppError from '../../error/AppError';
import config from '../../../config';
import { User } from '../User/user.model';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/emailSender';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTH SERVICES
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER USER
// ─────────────────────────────────────────────────────────────────────────────

export const registerUser = async (payload: TRegisterUser) => {
  // Check if user exists by phone (primary) or email
  const existingByPhone = await User.isUserExistsByPhone(payload.phone);
  if (existingByPhone) {
    throw new AppError(httpStatus.CONFLICT, 'A user with this phone number already exists.');
  }

  if (payload.email) {
    const existingByEmail = await User.isUserExistsByEmail(payload.email);
    if (existingByEmail) {
      if (existingByEmail.emailVerified) {
        throw new AppError(httpStatus.CONFLICT, 'This email is already registered.');
      }
      throw new AppError(httpStatus.BAD_REQUEST, 'This email exists but is not verified.');
    }
  }

  // Default role is USER
  payload.role = payload.role || USER_ROLE.USER;

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY);

  const newUser = await User.create({
    ...payload,
    status: USER_STATUS.PENDING,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: verificationTokenExpires,
  });

  // Send verification email if email provided
  if (newUser.email) {
    await sendVerificationEmail(newUser.email, verificationToken);
  }

  // Generate tokens
  const jwtPayload: Partial<TJwtPayload> = {
    _id: newUser._id?.toString() || '',
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    emailVerified: newUser.emailVerified,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY EMAIL
// ─────────────────────────────────────────────────────────────────────────────

const verifyEmail = async (token: string) => {
  const user = await User.findOne({
    emailVerificationToken: token,
  }).select('+emailVerificationToken +emailVerificationTokenExpires');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid verification token');
  }

  if (user.emailVerified) {
    return {
      message: 'Email is already verified',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    };
  }

  if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Verification token has expired');
  }

  // Update user
  user.emailVerified = true;
  user.status = USER_STATUS.ACTIVE;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  return {
    message: 'Email verified successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN USER
// ─────────────────────────────────────────────────────────────────────────────

const loginUser = async (payload: TLoginUser) => {
  // Support login with email OR phone
  let user = null;
  
  if (payload.email) {
    user = await User.isUserExistsByEmail(payload.email);
  } else if (payload.phone) {
    user = await User.isUserExistsByPhone(payload.phone);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email or phone number is required!');
  }

  if (!user) {
    if (payload.email) {
      throw new AppError(httpStatus.NOT_FOUND, 'No account found with this email address!');
    }

    throw new AppError(httpStatus.NOT_FOUND, 'No account found with this phone number!');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked!');
  }

  if (user.status === 'SUSPENDED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is suspended!');
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  const jwtPayload: Partial<TJwtPayload> = {
    _id: user._id?.toString() || '',
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

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked!');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Current password is incorrect!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────────────────────────────────────────

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked!');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token is no longer valid!');
  }

  const jwtPayload: Partial<TJwtPayload> = {
    _id: user._id?.toString() || '',
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

  return { accessToken };
};

// ─────────────────────────────────────────────────────────────────────────────
// RESEND VERIFICATION EMAIL
// ─────────────────────────────────────────────────────────────────────────────

const resendVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already verified');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationTokenExpires = verificationTokenExpires;
  await user.save();

  if (user.email) {
    await sendVerificationEmail(user.email, verificationToken);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'No email associated with this account');
  }

  return { message: 'Verification email resent successfully' };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET MY PROFILE
// ─────────────────────────────────────────────────────────────────────────────

const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

const forgotPassword = async (payload: TForgotPassword) => {
  const user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user account is blocked!');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY);

  user.passwordResetToken = resetToken;
  user.passwordResetTokenExpires = resetTokenExpires;
  await user.save();

  if (user.email) {
    await sendPasswordResetEmail(user.email, resetToken);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'No email associated with this account');
  }

  return { message: 'Password reset email sent successfully' };
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

const resetPassword = async (payload: TResetPassword) => {
  const user = await User.findOne({
    passwordResetToken: payload.token,
    passwordResetTokenExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetTokenExpires');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired password reset token');
  }

  user.password = payload.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: 'Password reset successfully' };
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────────────────

const logout = async (_token: string) => {
  return { message: 'Logged out successfully' };
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const AuthServices = {
  registerUser,
  loginUser,
  logout,
  changePassword,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  getMyProfile,
  forgotPassword,
  resetPassword,
};