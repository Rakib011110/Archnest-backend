/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USER CONSTANTS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Central location for all user-related constants.
 */

// ─────────────────────────────────────────────────────────────────────────────
// USER ROLES
// ─────────────────────────────────────────────────────────────────────────────

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  USER: 'USER',
} as const;

export type TUserRole = keyof typeof USER_ROLE;

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY: Record<TUserRole, number> = {
  USER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

// ─────────────────────────────────────────────────────────────────────────────
// USER STATUS
// ─────────────────────────────────────────────────────────────────────────────

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',      // Awaiting email verification
  SUSPENDED: 'SUSPENDED',  // Temporarily suspended
} as const;

export type TUserStatus = keyof typeof USER_STATUS;

// ─────────────────────────────────────────────────────────────────────────────
// GENDER OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type TGender = keyof typeof GENDER;

// ─────────────────────────────────────────────────────────────────────────────
// SEARCHABLE & FILTERABLE FIELDS
// ─────────────────────────────────────────────────────────────────────────────

export const USER_SEARCHABLE_FIELDS = ['name', 'email', 'phone'];

export const USER_FILTERABLE_FIELDS = ['role', 'status', 'emailVerified'];

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION DEFAULTS
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD REQUIREMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

// ─────────────────────────────────────────────────────────────────────────────
// TOKEN EXPIRY TIMES (in milliseconds)
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
export const PASSWORD_RESET_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes