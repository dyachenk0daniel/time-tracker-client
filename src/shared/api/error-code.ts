export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  AUTHORIZATION_HEADER_MISSING = 'AUTHORIZATION_HEADER_MISSING',
  INVALID_OR_EXPIRED_TOKEN = 'INVALID_OR_EXPIRED_TOKEN',
  TIME_ENTRY_NOT_FOUND = 'TIME_ENTRY_NOT_FOUND',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  TIME_ENTRY_ALREADY_STOPPED = 'TIME_ENTRY_ALREADY_STOPPED',
}
