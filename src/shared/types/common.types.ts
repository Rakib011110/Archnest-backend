// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: {
    code?: string;
    details?: any;
  };
}
