export const INQUIRY_STATUS = { NEW: 'NEW', CONTACTED: 'CONTACTED', IN_PROGRESS: 'IN_PROGRESS', CLOSED: 'CLOSED' } as const;
export type TInquiryStatus = keyof typeof INQUIRY_STATUS;
export const INQUIRY_SEARCHABLE_FIELDS = ['name', 'email', 'company', 'projectType'];
export const BUDGET_RANGES = ['UNDER_1K', '1K_5K', '5K_10K', '10K_25K', '25K_PLUS'] as const;
