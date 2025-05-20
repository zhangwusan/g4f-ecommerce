export interface LoginResponse {
    message: string;
    user: {
      id: number;
      username: string;
      avatar: string
      email: string;
      role: number;
    };
    token: {
      access: string;
      refresh: string;
    };
    access_expires_in: string;
  }
  