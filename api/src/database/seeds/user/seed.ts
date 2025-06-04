
import Role from "@/app/models/user/role.model";
import { data, generateUsers } from "./data";
import User from "@/app/models/user/user.model";

export class UserSeeder {

    public static seed = async () => {
        try {
            await UserSeeder.seedRoles();
            await UserSeeder.seedUsers();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data user:', error);
        }
    }

    private static async seedRoles() {
        try {
            await Role.bulkCreate(data.roles);
            console.log('\x1b[32mRoles data inserted successfully.');
        } catch (error) {
            console.error('Error seeding roles:', error);
            throw error;
        }
    }

    private static async seedUsers() {
        try {
            await User.bulkCreate(data.user);
            // // create more user
            // const users =  generateUsers(100);
            // await User.bulkCreate(users)
            console.log('\x1b[32mUser data inserted successfully.');
        } catch (error) {
            console.error('Error seeding users:', error);
            throw error;
        }
    }
}