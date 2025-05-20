
import Payment from "@/app/models/payment/payment.model";
import { data } from "./data";

export class PaymentSeeder {

    public static seed = async () => {
        try {
            await this.seedPayments();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Payments:', error);
        }
    }

    private static async seedPayments() {
        try {
            await Payment.bulkCreate(data.payments);
            console.log('\x1b[32mPayments data inserted successfully.');
        } catch (error) {
            console.error('Error seeding Payments:', error);
            throw error;
        }
    }
}