import Brand from "@/app/models/brand/brand.model";
import { data } from "./data";

export class BrandSeeder {

    public static seed = async () => {
        try {
            await this.seedBrands();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Brands:', error);
        }
    }

    private static async seedBrands() {
        try {
            await Brand.bulkCreate(data.brands);
            console.log('\x1b[32mBrands data inserted successfully.');
        } catch (error) {
            console.error('Error seeding Brands:', error);
            throw error;
        }
    }
}