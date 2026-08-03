export interface ErrorResponseBase {
  success: false;
  message: string;
  details?: string;
}

export interface ValidationErrorResponse extends ErrorResponseBase {
  code: 'VALIDATION_ERROR';
  fields: Record<string, string[]>;
}

export interface UnauthorizedResponse extends ErrorResponseBase {
  code: 'UNAUTHORIZED';
}

export interface ForbiddenResponse extends ErrorResponseBase {
  code: 'FORBIDDEN';
}

export interface ConflictResponse extends ErrorResponseBase {
  code: 'CONFLICT';
}

export interface NotFoundResponse extends ErrorResponseBase {
  code: 'NOT_FOUND';
}

export interface InternalServerErrorResponse extends ErrorResponseBase {
  code: 'INTERNAL_SERVER_ERROR';
}
