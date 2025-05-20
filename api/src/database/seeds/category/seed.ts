import Brand from "@/app/models/brand/brand.model";
import { data } from "./data";
import Category from "@/app/models/category/category.model";

export class CategorySeeder {

    public static seed = async () => {
        try {
            await this.seedCategories();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Categories:', error);
        }
    }

    private static async seedCategories() {
        try {
            await Category.bulkCreate(data.categories);
            console.log('\x1b[32mCategories data inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding Categories:', error);
            throw error;
        }
    }
}