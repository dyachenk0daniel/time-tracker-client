import TokenUtils from '@shared/utils/token.ts';

class AuthService {
  static logout(): void {
    TokenUtils.clearTokens();
    window.location.href = '/';
  }
}

export default AuthService;
