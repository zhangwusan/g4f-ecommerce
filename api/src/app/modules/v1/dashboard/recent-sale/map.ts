import Payment from "@/app/models/payment/payment.model";
import { SaleItem } from "./interface";

export const toSaleItem = (payment: Payment): SaleItem => {
  return {
    id: payment.payment_id,
    amount: parseFloat(payment.amount as any),
    user: {
      name: payment.order?.user?.username || "Unknown",
      email: payment.order?.user?.email || "",
      avatar: payment.order?.user?.avatar || undefined,
    },
  };
};