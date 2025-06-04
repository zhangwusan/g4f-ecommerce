
export interface PaymentDisplayHistory {
    payment_id: number;
    transaction_id: string;
    payment_method: string;
    payment_amount: number;
    order_status: string;
    shipping_address: string;
    payment_date: string;
}