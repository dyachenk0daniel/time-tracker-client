import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TokenUtils from '@shared/utils/token.ts';
import UserApi from './api';
import UserService from './service';
import { LoginRequest, RegisterRequest, UserResponse } from './types';

export const useCurrentUserQuery = () => {
  const { accessToken } = TokenUtils.getTokens();

  return useQuery<UserResponse | null>({
    queryKey: ['currentUser'],
    queryFn: () => UserApi.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: Boolean(accessToken),
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => UserApi.login(credentials),
    onSuccess: (data) => {
      TokenUtils.setTokens(data.accessToken, data.refreshToken);
      return queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => UserApi.register(userData),
    onSuccess: (data) => {
      TokenUtils.setTokens(data.accessToken, data.refreshToken);
      return queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    UserService.logout();
    queryClient.removeQueries({ queryKey: ['currentUser'] });
  };
};
