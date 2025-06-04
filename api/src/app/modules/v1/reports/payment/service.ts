import Order from "@/app/models/order/order.model";
import Payment from "@/app/models/payment/payment.model";
import User from "@/app/models/user/user.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ReportService } from "../service";
import OrderItem from "@/app/models/order/order-item.model";
import ProductVariant from "@/app/models/product/product-variants.model";
import OrderStatus from "@/app/models/order/order-status.model";
import Product from "@/app/models/product/product.model";
import ProductImage from "@/app/models/product/product-images.model";
import { toPaymentReport } from "./map";
import { title } from "process";

@Injectable()
export class PaymentReportService {

  constructor(private readonly _report_service: ReportService) { }

  async get_transaction_by_id(payment_id: number, user_id: number) {
    try {
      const payment = await Payment.findOne({
        where: { payment_id: payment_id },
        attributes: ['payment_method', 'transaction_id', 'amount', 'payment_status', 'payment_date'],
        include: [
          {
            model: Order,
            attributes: ['total_amount', 'shipping_address', 'order_date',],
            include: [
              {
                model: User,
                // where: { id: user_id },
                attributes: ['username']
              },
              {
                model: OrderItem,
                attributes: ['quantity', 'price_at_purchase'],
                as: 'order_items',
                include: [
                  {
                    model: ProductVariant,
                    attributes: ['price', 'discount'],
                    include: [
                      {
                        model: Product,
                        attributes: ['return_policy'],
                        include: [
                          {
                            model: ProductImage,
                            attributes: ['image_url'],
                            where: { is_main: true },
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                model: OrderStatus,
                attributes: ['name']
              }
            ]
          }
        ]
      })

      // if (!payment) {
      //   throw new BadRequestException('Payment not found or access denied.');
      // }

      // if (!payment.order) {
      //   throw new BadRequestException('Payment not found or access denied.');
      // }
      const data = toPaymentReport(payment)

      // generate report
      const buffer = await this._report_service.generate(
        data,
        'transaction',
        'pdf',
        './templates/payment/individual.hbs'
      )

      const base64 = `data:application/pdf;base64,${buffer.toString('base64')}`;
      return base64

    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

}