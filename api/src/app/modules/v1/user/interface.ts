
export interface UserDisplayResponse {
    user_id: number;
    username: string;
    email: string;
    phone_number: string;
    avatar: string;
    is_active: boolean;
    role_name: string;
    creator_name: string;
}

export interface UserDetailResponse {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    address: string;
    avatar: string;
    is_active: boolean;
    role_id: number;
    role_name: string;
    creator_name: string;
    bio: string;
}