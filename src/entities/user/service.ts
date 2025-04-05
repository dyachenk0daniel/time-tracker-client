import TokenUtils from '@shared/utils/token.ts';

class UserService {
  static logout(): void {
    TokenUtils.clearTokens();
    window.location.href = '/';
  }
}

export default UserService;
