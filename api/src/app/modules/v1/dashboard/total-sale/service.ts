import { Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';
import Order from '@/app/models/order/order.model';
import { TotalSaleResponse } from './interface';

@Injectable()
export class TotalSaleService {
    async get(): Promise<TotalSaleResponse> {
        const now = new Date();

        const start_of_this_month = new Date(now.getFullYear(), now.getMonth(), 1);
        const end_of_this_month = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const start_of_prev_month = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end_of_prev_month = new Date(now.getFullYear(), now.getMonth(), 0);

        const get_sale = async (start_date: Date, end_date: Date) => {
            const result: any = await Order.findOne({
                where: {
                    created_at: {
                        [Op.between]: [start_date, end_date],
                    },
                },
                attributes: [
                    [fn('SUM', col('total_amount')), 'total_amount'],
                    [fn('COUNT', col('order_id')), 'number_order'],
                ],
                raw: true,
            });

            return {
                amount: Number(result.total_amount || 0),
                order: Number(result.number_order || 0),
            };
        };

        const this_month = await get_sale(start_of_this_month, end_of_this_month);
        const prev_month = await get_sale(start_of_prev_month, end_of_prev_month);

        const growth =
            prev_month.amount === 0
                ? 100
                : +(((this_month.amount - prev_month.amount) / prev_month.amount) * 100).toFixed(2);

        const period = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

        const response: TotalSaleResponse = {
            title: 'Monthly Revenue',
            growth,
            period,
            total_sale: this_month.amount,
            order: this_month.order,
        };

        return response;
    }
}