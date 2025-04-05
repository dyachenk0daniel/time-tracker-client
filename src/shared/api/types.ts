import { AxiosRequestConfig } from 'axios';
import { ErrorCode } from './error-code';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  isAuthRequest?: boolean;
}

export interface ApiErrorPayload {
  code: ErrorCode;
  message: string;
  details: Record<string, unknown>;
}
