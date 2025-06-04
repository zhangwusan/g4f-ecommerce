import { Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';
import Order from '@/app/models/order/order.model';
import { MonthlySalesData, SalesResponse } from './interface';
import Payment from '@/app/models/payment/payment.model';

@Injectable()
export class SalesService {
    async get(): Promise<SalesResponse> {
        const now = new Date();
        const salesData: MonthlySalesData[] = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const whereClause: any = {
                payment_status: {
                    [Op.or]: [
                        'Completed',
                        'succeeded'
                    ]
                },
                payment_date: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            };

            const result: any = await Payment.findOne({
                where: whereClause,
                attributes: [[fn('SUM', col('amount')), 'amount']],
                raw: true,
            });

            const monthName = date.toLocaleString('default', { month: 'long' });
            const sales = Number(result.amount || 0);

            salesData.push({
                month: monthName,
                sales,
            });
        }

        return {
            title: 'Monthly Sales',
            description: 'Sales over the past 12 months',
            data: salesData,
        };
    }
}