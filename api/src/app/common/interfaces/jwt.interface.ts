
export interface UserPayload {
    id: number;
    username: string;
    avatar: string;
    email: string;
    role: number;
    role_name: string;
    is_2fa: boolean;
    is_2fa_verified?: boolean;
}

export interface JwtPayload {
    user: UserPayload;
    iat: number;
    exp: number;
}