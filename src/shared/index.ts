// ============================================================================
// SHARED MODULE EXPORTS — ArchNest Studio
// ============================================================================

// Base Classes
export { BaseController } from './base/BaseController';
export { BaseService } from './base/BaseService';

// Utilities
export { sendSuccess, sendError, sendPaginated } from './utils/response.util';
export { catchAsync } from './utils/catchAsync.util';
export {
  calculatePagination,
  calculateSkip,
  parsePaginationOptions,
} from './utils/pagination.util';

// Types
export type {
  PaginationOptions,
  PaginationMeta,
  PaginatedResult,
} from './types/pagination.types';
export type { ApiResponse, ErrorResponse } from './types/common.types';

// Constants
export { USER_ROLES, type UserRole } from './constants/roles.constant';
export {
  COMMON_STATUS,
  PROJECT_STATUS,
  BLOG_STATUS,
  INQUIRY_STATUS,
  BOOKING_STATUS,
  GALLERY_ITEM_TYPE,
  PROJECT_MARKET,
  PROJECT_CATEGORY,
  BUDGET_RANGE,
  type CommonStatus,
  type ProjectStatus,
  type BlogStatus,
  type InquiryStatus,
  type BookingStatus,
  type GalleryItemType,
  type ProjectMarket,
  type ProjectCategory,
  type BudgetRange,
} from './constants/status.constant';

// Errors
export { default as AppError } from './errors/AppError';
