export type BackendErrorCode =
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'BLOCKCHAIN_UNAVAILABLE'
  | 'BLOCKCHAIN_CALL_FAILED'
  | 'INTERNAL_ERROR';

export interface BackendErrorOptions {
  code: BackendErrorCode;
  message: string;
  status: number;
  details?: Record<string, unknown>;
  cause?: unknown;
}

export class BackendError extends Error {
  readonly code: BackendErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;
  readonly cause?: unknown;

  constructor(options: BackendErrorOptions) {
    super(options.message);
    this.name = 'BackendError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
    this.cause = options.cause;
  }
}

export interface BackendErrorResponseBody {
  error: {
    code: BackendErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

export function isBackendError(value: unknown): value is BackendError {
  return value instanceof BackendError;
}

export function normalizeBackendError(
  error: unknown,
  fallback: Omit<BackendErrorOptions, 'cause'>
): BackendError {
  if (isBackendError(error)) {
    return error;
  }

  return new BackendError({
    ...fallback,
    cause: error
  });
}

export function toBackendErrorResponse(error: BackendError): BackendErrorResponseBody {
  return {
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    }
  };
}
