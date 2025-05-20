
export interface UserPayload {
    id: number;
    username: string;
    avatar: string;
    email: string;
    role: number;
}

export interface JwtPayload {
    user: UserPayload;
    iat: number;
    exp: number;
}