import Category from '@/app/models/category/category.model';
import Product from '@/app/models/product/product.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { col, fn, Op } from 'sequelize';
import Payment from '@/app/models/payment/payment.model';
import User from '@/app/models/user/user.model';
import Order from '@/app/models/order/order.model';
import { toSaleItem } from './map';

@Injectable()
export class RecentSalesService {
    async get(start_date?: Date, end_date?: Date) {

        try {
            const whereCondition: any = {
                payment_status: {
                    [Op.or]: [
                        'Completed',
                        'succeeded'
                    ]
                },
            };

            if (start_date && end_date) {
                whereCondition.payment_date = {
                    [Op.between]: [start_date, end_date]
                }
            }


            const payments = await Payment.findAll({
                where: whereCondition,
                attributes: ['payment_id', 'payment_status', 'amount'],
                include: [
                    {
                        model: Order,
                        attributes: ['order_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['username', 'email', 'avatar']
                            }
                        ]

                    }
                ],
                limit: 15,
                order: [['payment_id', 'DESC']]
            })
            return {
                title: "Recent Sales",
                description: "Latest successful transactions",
                data: payments.map(toSaleItem)
            }

        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }
    }
}