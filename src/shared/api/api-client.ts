import axios from 'axios';
import TokenUtils from '@shared/utils/token.ts';
import apiConfig from './config';
import tokenRefresh from './token-refresh';
import { CustomAxiosRequestConfig } from './types';

const apiClient = axios.create(apiConfig);

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = TokenUtils.getTokens();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }

    return response;
  },
  async (error) => {
    const originalRequest: CustomAxiosRequestConfig = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.isAuthRequest) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await tokenRefresh();

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response.data?.error) {
      error.response.data = error.response.data.error;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
