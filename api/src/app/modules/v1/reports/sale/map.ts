import Payment from "@/app/models/payment/payment.model";
import { SaleReportInterface } from "./interface";



export function toSaleReportResponse(payment: Payment) : SaleReportInterface {
    return {
        payment_id: payment.payment_id || 0,
        payment_status: payment.payment_status || '',
        payment_method: payment.payment_method || '',
        payment_date: payment.payment_date.toUTCString() || '',
        payment_amount: +payment.amount || 0,
        order_id: payment.order.order_id || 0,
        order_username: payment.order.user.username || '',
        order_shipping_address: payment.order.shipping_address || '',
    }
}