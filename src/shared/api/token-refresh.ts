import axios from 'axios';
import TokenUtils from '@shared/utils/token.ts';
import apiConfig from './config';
import AuthService from '@entities/user/auth-service.ts';

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

const refreshClient = axios.create(apiConfig);
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  try {
    failedQueue.forEach((prom: QueueItem) => {
      if (error) {
        prom.reject(error);
        return;
      }

      if (token) {
        prom.resolve(token);
      }
    });
  } finally {
    failedQueue = [];
  }
};

async function tokenRefresh(): Promise<string> {
  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const { refreshToken } = TokenUtils.getTokens();

    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    const response = await refreshClient.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    TokenUtils.setTokens(newAccessToken, newRefreshToken);
    processQueue(null, newAccessToken);

    return newAccessToken;
  } catch (error) {
    processQueue(error, null);
    AuthService.logout();
    console.log(error);

    throw error;
  } finally {
    isRefreshing = false;
  }
}

export default tokenRefresh;
