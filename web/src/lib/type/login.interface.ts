export interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    avatar: string
    email: string;
    role: number;
    role_name: string;
    is_2fa: boolean;
  };
  token: {
    access: string;
    refresh: string;
  };
  access_expires_in: string;
}

export interface LoginWith2FAResponse {
  requires2FA: boolean,
  tempToken: string,
}
