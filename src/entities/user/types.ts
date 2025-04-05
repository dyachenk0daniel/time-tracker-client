export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
