import { RoleEnum } from "@/app/common/utils/enum/role.enum";

export const data = {
    roles: [
        {
            id: RoleEnum.ADMIN,
            name: 'admin',
            description: 'Administrator role with full access',
        },
        {
            id: RoleEnum.USER,
            name: 'user',
            description: 'Regular user role with limited access',
        },
        {
            id: RoleEnum.GUEST,
            name: 'guest',
            description: 'Guest role with minimal access',
        }
    ],
    user: [
        {
            first_name: 'admin',
            last_name: 'admin',
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'admin@1234',
            phone_number: '0123456789',
            address: '123 Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.ADMIN, // Admin role
        },
        {
            first_name: 'Sok',
            last_name: 'Davan',
            username: 'sokdavan',
            email: 'sokdavan@gmail.com',
            password: 'sokdavan@1234',
            phone_number: '0123456789',
            address: '123 Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
        },
        {
            first_name: 'Sok',
            last_name: 'Ny',
            username: 'sokny',
            email: 'sokny@gmail.com',
            password: 'sokny@1234',
            phone_number: '0123456789',
            address: '123 Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // Guest role
        },
        {
            first_name: 'Alice',
            last_name: 'Smith',
            username: 'alice.smith',
            email: 'alice.smith@gmail.com',
            password: 'alice@1234',
            phone_number: '0123456789',
            address: '456 Elm Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
        },
        {
            first_name: 'Bob',
            last_name: 'Johnson',
            username: 'bob.johnson',
            email: 'bob.johnson@gmail.com',
            password: 'bob@1234',
            phone_number: '0123456789',
            address: '789 Pine Road, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
        },
        {
            first_name: 'Charlie',
            last_name: 'Brown',
            username: 'charlie.brown',
            email: 'charlie.brown@gmail.com',
            password: 'charlie@1234',
            phone_number: '0123456789',
            address: '321 Oak Avenue, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // Guest role
        },
        {
            first_name: 'Diana',
            last_name: 'Prince',
            username: 'diana.prince',
            email: 'diana.prince@gmail.com',
            password: 'diana@1234',
            phone_number: '0123456789',
            address: '654 Maple Blvd, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
        },
        {
            first_name: 'Eve',
            last_name: 'Green',
            username: 'eve.green',
            email: 'eve.green@gmail.com',
            password: 'eve@1234',
            phone_number: '0123456789',
            address: '987 Birch Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.GUEST, // Guest role
        },
        {
            first_name: 'Frank',
            last_name: 'White',
            username: 'frank.white',
            email: 'frank.white@gmail.com',
            password: 'frank@1234',
            phone_number: '0123456789',
            address: '654 Cedar Way, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
        },
        {
            first_name: 'Grace',
            last_name: 'Lee',
            username: 'grace.lee',
            email: 'grace.lee@gmail.com',
            password: 'grace@1234',
            phone_number: '0123456789',
            address: '123 Willow Path, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // Admin role
        }
    ]
};