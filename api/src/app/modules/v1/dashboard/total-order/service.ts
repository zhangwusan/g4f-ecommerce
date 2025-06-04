import { BadRequestException, Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';
import { TotalOrderResponse } from './interface';
import Order from '@/app/models/order/order.model';

@Injectable()
export class TotalOrderService {
    async get(start_date?: Date, end_date?: Date) {
        try {
            const whereCondition: any = {}
            if(start_date && end_date) {
                whereCondition.order_date = {
                    [Op.between]: [start_date, end_date],
                }
            }
            const result: any = await Order.findOne({
                attributes: [[fn("COUNT", col('order_id')), 'total_order']],
                where: whereCondition,
                raw: true,
            })

            return {
                title: 'Number Of Order',
                value: Number(result.total_order || 0)
            }

        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }
}