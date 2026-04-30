// ============================================================================
// PROJECT CONSTANTS
// ============================================================================

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

export const PROJECT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type TProjectMarket = keyof typeof PROJECT_MARKET;
export type TProjectCategory = keyof typeof PROJECT_CATEGORY;
export type TProjectStatus = keyof typeof PROJECT_STATUS;

export const PROJECT_SEARCHABLE_FIELDS = ['title', 'clientName', 'location', 'country'];
export const PROJECT_FILTERABLE_FIELDS = ['market', 'category', 'status', 'isFeatured', 'serviceType'];
