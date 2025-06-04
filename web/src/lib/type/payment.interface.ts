export interface PaymentDisplayHistory {
    payment_id: string;
    transaction_id: string;
    payment_method: string;
    payment_amount: number;
    order_status: string;
    shipping_address: string;
    payment_date: string;
}

export interface OrderItem {
  quantity: number;
  price_at_purchase: number;
  price: number;
  discount: number;
  return_policy: string;
  image: string;
}

export interface PaymentDetail {
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
  order_items: OrderItem[];
}