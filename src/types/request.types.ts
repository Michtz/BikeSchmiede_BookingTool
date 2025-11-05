/**
 * Structure of a request error which comes from
 * axios interceptor
 */

export interface RequestError extends ErrorResponse {
  name: string;
  trace: string;
  path: string;
  timestamp: number;
  code: string | number;
}

/**
 * Structure of a failed API response
 */

export interface ErrorResponse {
  errorCode?: string;
  message: string;
  data?: any;
}
