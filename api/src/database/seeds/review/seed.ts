import { data } from "./data";
import Review from "@/app/models/review/review.model";


export class ReviewSeeder {

    public static seed = async () => {
        try {
            await this.seedReviews();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Reviews:', error);
        }
    }

    private static async seedReviews() {
        try {
            await Review.bulkCreate(data.reviews);
            console.log('\x1b[32mReviews data inserted successfully.');
        } catch (error) {
            console.error('Error seeding Reviews:', error);
            throw error;
        }
    }
}