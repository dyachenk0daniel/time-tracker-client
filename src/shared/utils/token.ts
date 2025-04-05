class TokenUtils {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(TokenUtils.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TokenUtils.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getTokens() {
    const accessToken = localStorage.getItem(TokenUtils.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(TokenUtils.REFRESH_TOKEN_KEY);
    return { accessToken, refreshToken };
  }

  static clearTokens(): void {
    localStorage.removeItem(TokenUtils.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TokenUtils.REFRESH_TOKEN_KEY);
  }
}

export default TokenUtils;
