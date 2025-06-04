import { BadRequestException, Injectable } from '@nestjs/common';
import { col, fn, Op, Sequelize } from 'sequelize';
import Order from '@/app/models/order/order.model';
import { TotalStockResponse } from './interface';
import Product from '@/app/models/product/product.model';

@Injectable()
export class TotalStockService {
    async get(id?: number, start_date?: Date, end_date?: Date) {
        try {
            const whereCondition: any = {}
            // if (id) {
            //     whereCondition['product_id'] = id
            // }

            // if (start_date && end_date) {
            //     whereCondition.created_at = {
            //         [Op.between]: [start_date, end_date]
            //     }
            // }

            const products = await Product.findAll({
                where: whereCondition,
                attributes: [
                    [
                        Sequelize.literal(`(
                        SELECT SUM(stock)
                        FROM product_variants AS pv
                        WHERE pv.product_id = "Product".product_id
                    )`),
                        'stock_count'
                    ]
                ],
            })

            const response: TotalStockResponse = {
                title: 'Total Stock',
                total_stock: products.reduce((acc, item) => acc + Number((item.getDataValue('stock_count') ?? 0)), 0),
            };

            return response;

        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }

    }
}