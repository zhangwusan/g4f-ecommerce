export interface RoleDisplay {
  id: number;
  name: string;
}

export interface HeadersDisplay {
  id: string;
  label: string;
}


export interface User {
  id: string,
  username: string;
  password: string;
  email?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  address: string;
  avatar?: string;
  is_active: boolean;
  bio?: string;
  role_id: number;
}

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  address: string;
  is_active: boolean;
  bio?: string;
  role_id: number;
}

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


