import { RoleEnum, RoleEnumMap } from "@/app/common/utils/enum/role.enum";

export const generateUsers = (count: number) => {
    const users = [];

    for (let i = 1; i <= count; i++) {
        users.push({
            first_name: `User${i}`,
            last_name: `Test${i}`,
            username: `user${i}`,
            email: `user${i}@example.com`,
            password: '12345678',
            phone_number: `09${(10000000 + i).toString().slice(-8)}`,
            address: `${i * 10} Example St, City`,
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER,
            creator_id: 1,
        });
    }
    return users;
};

export const data = {
    roles: [
        {
            name: RoleEnumMap[RoleEnum.ADMIN],
            description: 'Administrator role with full access',
        },
        {
            name: RoleEnumMap[RoleEnum.USER],
            description: 'Regular user role with limited access',
        },
        {
            name: RoleEnumMap[RoleEnum.GUEST],
            description: 'Guest role with minimal access',
        },
        {
            name: RoleEnumMap[RoleEnum.REGISTER],
            description: 'Register role with minimal access',
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
            creator_id: 1
        },
        {
            first_name: 'Register',
            last_name: 'register',
            username: 'register',
            email: 'register@gmail.com',
            password: 'Register@1234',
            phone_number: '0123456789',
            address: '123 Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.USER, // User role
            creator_id: 1
        },
        {
            first_name: 'hack',
            last_name: 'me',
            username: 'h43kme',
            email: 'h43kme@gmail.com',
            password: '12345678',
            phone_number: '0123456789',
            address: '123 Street, City',
            avatar: '/public/static/avatar.jpg',
            is_active: true,
            role_id: RoleEnum.ADMIN,
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
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
            creator_id: 1
        },
    ]
};