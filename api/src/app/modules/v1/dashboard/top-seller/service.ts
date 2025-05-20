import { Injectable } from '@nestjs/common';
import { col, fn } from 'sequelize';
import OrderItem from '@/app/models/order/order-item.model';
import Product from '@/app/models/product/product.model';
import { TopSellingProductsResponse, TopSellingProduct } from './interface';

@Injectable()
export class TopSellingService {
  async get(): Promise<TopSellingProductsResponse> {
    const results = await OrderItem.findAll({
      attributes: [
        [col('product.product_name'), 'product'],
        [fn('SUM', col('quantity')), 'sales'],
      ],
      include: [
        {
          model: Product,
          attributes: [], // we only want the name, already selected above
        },
      ],
      group: ['product.product_id'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 10,
      raw: true,
    });

    const data: TopSellingProduct[] = results.map((row: any) => ({
      product: row.product,
      sales: Number(row.sales),
    }));

    return {
      title: 'Top Selling Products',
      description: 'Last',
      data,
    };
  }
}