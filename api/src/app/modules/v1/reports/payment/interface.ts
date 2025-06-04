export interface PaymentReportInterface {
    payment_method: string;
    payment_transaction: string;
    payment_amount: number;
    payment_status: string;
    payment_date: string;
    order_total_amount: number;
    order_shipping_address: string;
    order_date: string;
    order_username: string;
    order_status: string;
    order_items: {
        quantity: number;
        price_at_purchase: number;
        price: number;
        discount: number;
        return_policy: string;
        image: string;
    }[]
}