import { isAxiosError } from 'axios';
import { ApiErrorPayload } from '@shared/api/types';
import { ErrorCode } from '@shared/api/error-code';

type NotifyFn = (message: string) => void;

const GENERIC_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';
const SERVER_ERROR_MESSAGE = 'An internal server error occurred. Please try again later.';

export function handleTimeEntryError(
  err: unknown,
  context: string,
  notify: NotifyFn,
  codeMessages: Partial<Record<ErrorCode, string>> = {}
): void {
  if (!isAxiosError<ApiErrorPayload>(err)) {
    console.error(`Non-API Error (${context}):`, err);
    notify(GENERIC_ERROR_MESSAGE);
    return;
  }

  const errorCode = err.response?.data.code;
  const serverMessage = err.response?.data.message;

  if (errorCode && errorCode in codeMessages) {
    notify(codeMessages[errorCode]!);
    return;
  }

  if (errorCode === ErrorCode.INTERNAL_SERVER_ERROR) {
    notify(SERVER_ERROR_MESSAGE);
    return;
  }

  console.error(`API Error (${context}):`, {
    code: errorCode,
    message: serverMessage,
    status: err.response?.status,
  });

  notify(serverMessage || `Failed to ${context}. Please try again.`);
}
