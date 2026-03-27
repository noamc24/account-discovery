export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface MeResponse {
  message: string;
  user: User;
}