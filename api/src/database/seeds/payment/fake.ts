import Order from '@/app/models/order/order.model';
import Payment from '@/app/models/payment/payment.model';
import User from '@/app/models/user/user.model';
import OrderStatus from '@/app/models/order/order-status.model';
import { faker } from '@faker-js/faker';

export class OrderPaymentSeeder {
  public static async seed(orderCount = 10) {
    try {
      const users = await User.findAll();
      const statuses = await OrderStatus.findAll();

      for (let i = 0; i < orderCount; i++) {
        const user = faker.helpers.arrayElement(users);
        const status = faker.helpers.arrayElement(statuses);

        const order = await Order.create({
          user_id: user.id,
          order_date: faker.date.recent({days: 30 + i}),
          total_amount: Number(faker.commerce.price({min: 20, max: 500})),
          shipping_address: faker.location.streetAddress(true),
          order_status_id: status.id,
        });

        await Payment.create({
          order_id: order.order_id,
          payment_method: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer']),
          transaction_id: faker.string.uuid(),
          amount: order.total_amount,
          payment_status: faker.helpers.arrayElement(['succeeded', 'pending', 'failed']),
          payment_date: new Date(),
        });
      }

      console.log('\x1b[32mOrders and payments seeded successfully.');
    } catch (error) {
      console.error('\x1b[31mError seeding orders/payments:', error);
    }
  }
}