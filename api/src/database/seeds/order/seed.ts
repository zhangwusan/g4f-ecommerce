import { data } from "./data";
import Order from "@/app/models/order/order.model";
import OrderItem from "@/app/models/order/order-item.model";
import { faker } from '@faker-js/faker';


export class OrderSeeder {

    public static seed = async () => {
        try {
            await this.seedOrders();
            await this.seedOrderItems();
            await this.seedOrderAndOrderItemsGenerate();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Orders:', error);
        }
    }

    private static async seedOrders() {
        try {
            await Order.bulkCreate(data.ordres);
            console.log('\x1b[32mOrders data inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Orders:', error);
            throw error;
        }
    }

    private static async seedOrderItems() {
        try {
            await OrderItem.bulkCreate(data.order_items);
            console.log('\x1b[32mOrderItems data inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Orders:', error);
            throw error;
        }
    }

    private static async seedOrderAndOrderItemsGenerate() {
        const { order_items, orders } = this.generate_data();
        try {
            await Order.bulkCreate(orders);
            await OrderItem.bulkCreate(order_items);
            console.log('\x1b[32mData inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data :', error);
            throw error;
        }

    }

    private static generate_data() {
        const NUM_ORDERS = 100; // or 365 if you want one per day
        const NUM_USERS = 10;
        const NUM_PRODUCTS = 50;

        const orders = [];
        const order_items = [];
        for (let i = 1; i <= NUM_ORDERS; i++) {
            const orderDate = faker.date.between({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date(),
            });

            orders.push({
                order_id: 10 + i,
                user_id: faker.number.int({ min: 1, max: NUM_USERS }),
                order_date: orderDate,
                total_amount: faker.number.float({ min: 20, max: 500 }),
                shipping_address: faker.location.streetAddress(),
                order_status: faker.helpers.arrayElement(['Pending', 'Shipped', 'Delivered', 'Cancelled']),
                created_at: orderDate,
                updated_at: orderDate,
            });

            // Generate 1–3 items per order
            const itemCount = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < itemCount; j++) {
                order_items.push({
                    order_item_id: order_items.length + 11,
                    order_id: i,
                    product_id: faker.number.int({ min: 1, max: NUM_PRODUCTS }),
                    quantity: faker.number.int({ min: 1, max: 5 }),
                    price_at_purchase: faker.number.float({ min: 10, max: 150 }),
                });
            }
        }
        return {
            order_items,
            orders
        }
    }
}
