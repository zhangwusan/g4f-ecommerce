import Order from "@/app/models/order/order.model";
import Payment from "@/app/models/payment/payment.model";
import User from "@/app/models/user/user.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { col, fn, Op } from "sequelize";
import { ReportService } from "../service";
import { toSaleReportResponse } from "./map";

@Injectable()
export class SaleReportService {

  constructor(private readonly _report_service: ReportService) { }

  async get_sale(type: string, startOfDate: Date, endOfDate: Date, format: 'pdf' | 'excel' = 'pdf') {

    try {
      const whereClause: any = {
        payment_status: {
          [Op.or]: [
            'Completed',
            'succeeded'
          ]
        },
        payment_date: {
          [Op.between]: [startOfDate, endOfDate],
        },
      };

      console.log("Where clause : ", whereClause)

      const result = await Payment.findAll({
        where: whereClause,
        attributes: [
          'payment_id',
          'payment_status',
          'transaction_id',
          'payment_date',
          'payment_method',
          'amount',
        ],
        include: [
          {
            model: Order,
            attributes: ['shipping_address', 'order_id'],
            include: [
              {
                model: User,
                attributes: ['username', 'id']
              }
            ]
          }
        ],
      });

      if (!result?.length) {
        throw new BadRequestException('Failed to get payment data.')
      }

      const data = result.map(toSaleReportResponse);

      const total = data.reduce((acc, item) => acc + item.payment_amount, 0)

      const buffer = await this._report_service.generate(
        {
          items: data,
          summary: total
        },
        `Report Sale ${type ? type.toUpperCase() : ''} `,
        format,
        './templates/sale.hbs'
      );

      const mimeType =
        format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf';

      const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;

      return base64

    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }

  }
}