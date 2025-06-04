import { faker } from '@faker-js/faker';
import Payment from '@/app/models/payment/payment.model';
import Order from '@/app/models/order/order.model';

export class PaymentSeeder {
  public static seed = async () => {
    try {
      await this.seedPayments();
      console.log('\x1b[32mData seeded successfully.');
    } catch (error) {
      console.error('\x1b[31m\nError seeding data Payments:', error);
    }
  };

  private static async seedPayments() {
    try {
      const orders = await Order.findAll({ attributes: ['order_id', 'total_amount', 'order_date'] });

      if (orders.length === 0) {
        throw new Error('No orders found to assign payments to.');
      }

      const payments = orders.map((order) => {
        const paymentDate = order.order_date;
        const transactionId = `TXN-${faker.string.alphanumeric(10).toUpperCase()}`;

        return {
          order_id: order.order_id,
          amount: order.total_amount,
          payment_method: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
          payment_status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed']),
          payment_date: paymentDate,
          transaction_id: transactionId,
          created_at: paymentDate,
          updated_at: paymentDate,
        };
      });

      await Payment.bulkCreate(payments);
      console.log('\x1b[32mPayments data inserted successfully.');
    } catch (error) {
      console.error('\x1b[31mError seeding Payments:', error);
      throw error;
    }
  }
}