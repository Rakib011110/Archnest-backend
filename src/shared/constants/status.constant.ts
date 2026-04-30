// ============================================================================
// ARCHNEST STUDIO — STATUS CONSTANTS
// ============================================================================

export const COMMON_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const PROJECT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const BLOG_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const INQUIRY_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const GALLERY_ITEM_TYPE = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
  VIRTUAL_TOUR: 'VIRTUAL_TOUR',
} as const;

export const PROJECT_MARKET = {
  INTERNATIONAL: 'INTERNATIONAL',
  LOCAL: 'LOCAL',
} as const;

export const PROJECT_CATEGORY = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  INSTITUTIONAL: 'INSTITUTIONAL',
  LANDSCAPE: 'LANDSCAPE',
} as const;

export const BUDGET_RANGE = {
  UNDER_1K: 'UNDER_1K',
  '1K_5K': '1K_5K',
  '5K_10K': '5K_10K',
  '10K_25K': '10K_25K',
  '25K_PLUS': '25K_PLUS',
} as const;

// Type exports
export type CommonStatus = (typeof COMMON_STATUS)[keyof typeof COMMON_STATUS];
export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];
export type BlogStatus = (typeof BLOG_STATUS)[keyof typeof BLOG_STATUS];
export type InquiryStatus = (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
export type GalleryItemType = (typeof GALLERY_ITEM_TYPE)[keyof typeof GALLERY_ITEM_TYPE];
export type ProjectMarket = (typeof PROJECT_MARKET)[keyof typeof PROJECT_MARKET];
export type ProjectCategory = (typeof PROJECT_CATEGORY)[keyof typeof PROJECT_CATEGORY];
export type BudgetRange = (typeof BUDGET_RANGE)[keyof typeof BUDGET_RANGE];
