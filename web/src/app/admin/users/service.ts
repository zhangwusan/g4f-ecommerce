import { FetchUserParams, Pagination } from '@/lib/type/api-response.interface';
import { CreateUserPayload, HeadersDisplay, RoleDisplay, UpdateUserPayload, UserDetailResponse, UserDisplayResponse } from '@/lib/type/user.interface';

export const fetchUsers = async ({
    limit = 10,
    page = 1,
    sort,
    order,
    search,
    filter,
}: FetchUserParams): Promise<{ data: UserDisplayResponse[]; pagination: Pagination; headers: HeadersDisplay[] }> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('page', page.toString());
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);
    if (search) params.append('search', search);

    if (filter) {
        const filterString = Object.entries(filter)
            .map(([key, value]) => `${key}:${value}`)
            .join(',');
        params.append('filter', filterString);
    }

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load users.');

    return res.json();
};

export const fetchRoles = async (): Promise<RoleDisplay[]> => {
    const res = await fetch('/api/admin/users/setup');
    if (!res.ok) throw new Error('Failed to fetch role users.');

    const { data } = await res.json();
    return data;
};

export const deleteUser = async (id: number): Promise<string> => {
    const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete user.');
    return res.json()
};

export const createUser = async (user: CreateUserPayload): Promise<UserDisplayResponse> => {
    const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create user');
    }

    return res.json();
};

export const getUserById = async (user_id: string): Promise<UserDetailResponse> => {
    const res = await fetch(`/api/admin/users/${user_id}`, {
        method: 'GET',
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
    }
    return res.json();
}

export const updateUser = async (user_id: string, user: UpdateUserPayload | UserDetailResponse) => {
    const payload: UpdateUserPayload = 'user_id' in user
        ? {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            is_active: user.is_active,
            bio: user.bio,
            role_id: user.role_id,
        }
        : user;
    const res = await fetch(`/api/admin/users/${user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
    }
    return res.json();
}