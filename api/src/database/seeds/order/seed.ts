import Order from "@/app/models/order/order.model";
import OrderItem from "@/app/models/order/order-item.model";
import { faker } from '@faker-js/faker';
import { ORDER_STATUS } from "@/app/common/utils/enum/order-status.enum";
import OrderStatus from "@/app/models/order/order-status.model";
import ProductVariant from "@/app/models/product/product-variants.model";


export class OrderSeeder {

    public static seed = async () => {
        try {
            await this.seedOrderStatus();
            await this.seedOrderAndOrderItemsGenerate();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Orders:', error);
        }
    }

    private static async seedOrderStatus() {
        try {
            const statuses = Object.values(ORDER_STATUS).map((name) => ({ name }));
            await OrderStatus.bulkCreate(statuses)
            console.log('\x1b[32mData inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data:', error);
            throw error;
        }
    }

    private static async seedOrderAndOrderItemsGenerate() {
        const { order_items, orders } = await this.generate_data();
        try {
            await Order.bulkCreate(orders);
            await OrderItem.bulkCreate(order_items);
            console.log('\x1b[32mData inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data :', error);
            throw error;
        }

    }

    private static async generate_data() {
        const NUM_ORDERS = 100;
        const NUM_USERS = 10;

        const orders = [];
        const order_items = [];

        // 1. Get product variant prices
        const variants = await ProductVariant.findAll({
            attributes: ['variant_id', 'price', 'discount'],
        });

        const variantMap = Object.fromEntries(
            variants.map(v => [
                v.variant_id,
                {
                    price: parseFloat(v.price as any),
                    discount: parseFloat(v.discount as any), // percentage, e.g., 10 means 10%
                }
            ])
        );

        const variantIds = Object.keys(variantMap).map(Number);
        if (variantIds.length === 0) throw new Error('No product variants found.');

        // 2. Get order statuses
        const statusMap = await OrderStatus.findAll().then((statuses) =>
            Object.fromEntries(statuses.map(s => [s.name, s.id]))
        );

        // 3. Get max existing order_id

        const startDate = new Date(new Date().getFullYear(), 0, 1); // Jan 1

        for (let i = 1; i <= NUM_ORDERS; i++) {
            const maxOffsetDays = 90;
            const randomOffset = Math.floor(Math.random() * maxOffsetDays);

            const orderDate = new Date(); // today
            orderDate.setDate(orderDate.getDate() - randomOffset);

            const statusName = faker.helpers.arrayElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Completed']);
            const statusId = statusMap[statusName];
            if (!statusId) throw new Error(`Status "${statusName}" not found`);

            const user_id = faker.number.int({ min: 1, max: NUM_USERS });
            const itemCount = faker.number.int({ min: 1, max: 3 });

            let orderTotal = 0;

            for (let j = 1; j <= itemCount; j++) {
                const variant_id = faker.helpers.arrayElement(variantIds);
                const variant = variantMap[variant_id];
                const quantity = faker.number.int({ min: 1, max: 5 });
                const effectivePrice = variant.price * (1 - variant.discount / 100);
                const itemTotal = Number(variant.price) * Number(quantity);

                orderTotal += itemTotal;

                order_items.push({
                    order_id: i,
                    variant_id,
                    quantity,
                    price_at_purchase: parseFloat(effectivePrice.toFixed(2)),
                    created_at: orderDate,
                    updated_at: orderDate,
                });
            }

            orders.push({
                user_id,
                order_date: orderDate,
                total_amount: parseFloat(orderTotal.toFixed(2)),
                shipping_address: faker.location.streetAddress(),
                order_status_id: statusId,
                created_at: orderDate,
                updated_at: orderDate,
            });
        }

        return {
            orders,
            order_items,
        };
    }
}
