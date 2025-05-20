import Product from "@/app/models/product/product.model";
import { data } from "./data";
import ProductImage from "@/app/models/product/images.model";


export class ProductSeeder {

    public static seed = async () => {
        try {
            await this.seedProducts();
            await this.seedImageProducts();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Products:', error);
        }
    }

    private static async seedProducts() {
        try {
            await Product.bulkCreate(data.products);
            console.log('\x1b[Products data inserted successfully.');
        } catch (error) {
            console.error('Error seeding Products:', error);
            throw error;
        }
    }

    private static async seedImageProducts() {
        try {
            await ProductImage.bulkCreate(data.images);
            console.log('\x1b[Products image data inserted successfully.');
        } catch (error) {
            console.error('Error seeding Products images :', error);
            throw error;
        }
    }
}