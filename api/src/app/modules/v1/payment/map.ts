import Payment from "@/app/models/payment/payment.model";
import { PaymentDisplayHistory } from "./interface";

export function toPaymentDisplayHistory(data: Payment): PaymentDisplayHistory {
  return {
    payment_id: data.payment_id,
    transaction_id: data.transaction_id,
    payment_method: data.payment_method,
    payment_amount: parseFloat(data.amount.toString()),
    order_status: data.order?.order_status?.name ?? 'Unknown',
    shipping_address: data.order?.shipping_address ?? 'N/A',
    payment_date: data.payment_date.toUTCString(),
  };
}