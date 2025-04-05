import apiClient from '@shared/api/api-client.ts';
import { CustomAxiosRequestConfig } from '@shared/api/types.ts';
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from './types';

class UserApi {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials, {
      isAuthRequest: true,
    } as CustomAxiosRequestConfig);

    return response.data;
  }

  static async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', userData, {
      isAuthRequest: true,
    } as CustomAxiosRequestConfig);
    return response.data;
  }

  static async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
  }
}

export default UserApi;
