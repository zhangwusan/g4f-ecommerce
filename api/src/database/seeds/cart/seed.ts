import Cart from "@/app/models/cart/cart.model";
import { data } from "./data";
import CartItem from "@/app/models/cart/cart-item.model";


export class CartSeeder {

    public static seed = async () => {
        try {
            await this.seedCarts();
            await this.seedCartItems();
            console.log('\x1b[32mData seeded successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Carts:', error);
        }
    }

    private static async seedCarts() {
        try {
            await Cart.bulkCreate(data.carts);
            console.log('\x1b[32mCarts data inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Carts:', error);
            throw error;
        }
    }
    private static async seedCartItems() {
        try {
            await CartItem.bulkCreate(data.cart_items);
            console.log('\x1b[32mCartItems data inserted successfully.');
        } catch (error) {
            console.error('\x1b[31m\nError seeding data Carts:', error);
            throw error;
        }
    }
}