import Payment from "@/app/models/payment/payment.model";
import { PaymentReportInterface } from "./interface";
import OrderItem from "@/app/models/order/order-item.model";

export function toPaymentReport(payment: Payment): PaymentReportInterface {
    return {
        payment_method: payment.payment_method ?? 'N/A',
        payment_transaction: payment.transaction_id ?? 'N/A',
        payment_amount: parseFloat(payment.amount.toString()) ?? 0,
        payment_status: payment.payment_status ?? 'N/A',
        payment_date: payment.payment_date.toUTCString() ?? 'N/A',
        order_total_amount: parseFloat(payment.order.total_amount.toString()) ?? 0,
        order_shipping_address: payment.order.shipping_address ?? 'N/A',
        order_date: payment.order.order_date.toUTCString() ?? 'N/A',
        order_username: payment.order.user.username ?? 'N/A',
        order_status: payment.order.order_status.name ?? 'N/A',
        order_items: payment.order.order_items.map((item: OrderItem) => ({
            quantity: item.quantity ?? 0,
            price_at_purchase: parseFloat(item.price_at_purchase.toString()) ?? 0,
            price: parseFloat(item.variant.price.toString()) ?? 0,
            discount: parseFloat(item.variant.discount.toString()) ?? 0,
            return_policy: item.variant.product.return_policy ?? 'N/A',
            image: item.variant.product.images.length > 0 ? item.variant.product.images[0].image_url : "",
        })),
    };
}