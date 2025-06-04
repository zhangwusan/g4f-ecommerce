import Payment from '@/app/models/payment/payment.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';

@Injectable()
export class TotalRevenueService {
    async get(start_date?: Date, end_date?: Date) {
        try {
            const whereClause: any = {
                payment_status: {
                    [Op.or]: [
                        'Completed',
                        'succeeded'
                    ]
                },
            };

            if (start_date && end_date) {
                whereClause.payment_date = {
                    [Op.between]: [start_date, end_date],
                };
            }

            const result: any = await Payment.findOne({
                attributes: [[fn('SUM', col('amount')), 'total_revenue']],
                where: whereClause,
                raw: true,
            });

            return { 
                title: 'Total Revenue',
                amount: parseFloat(result.total_revenue || '0')
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }
}