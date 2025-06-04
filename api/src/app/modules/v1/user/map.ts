import User from "@/app/models/user/user.model";
import { UserDetailResponse, UserDisplayResponse } from "./interface";



export const mapToUserDisplayResponse = (user: User): UserDisplayResponse => ({
    user_id: user.id,
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
    avatar: user.avatar,
    is_active: user.is_active,
    role_name: user.role?.name,
    creator_name: user.creator?.username
})

export const mapToUserDetailResponse = (user: User) : UserDetailResponse => ({
    user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    email: user.email,
    phone_number: user.phone_number,
    address: user.address,
    avatar: user.avatar,
    is_active: user.is_active,
    role_id: user.role?.id,
    role_name: user.role?.name,
    creator_name: user.creator?.username,
    bio: user.bio
})