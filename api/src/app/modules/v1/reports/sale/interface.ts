export interface SaleReportInterface {
    payment_id: number;
    payment_status: string;
    payment_date: string;
    payment_method: string;
    payment_amount: number;
    order_id: number;
    order_shipping_address: string;
    order_username: string;
}