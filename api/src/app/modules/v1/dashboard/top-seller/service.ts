import { Injectable } from '@nestjs/common';
import { col, fn } from 'sequelize';
import OrderItem from '@/app/models/order/order-item.model';
import Product from '@/app/models/product/product.model';
import { TopSellingProductsResponse, TopSellingProduct } from './interface';
import ProductVariant from '@/app/models/product/product-variants.model';

@Injectable()
export class TopSellingService {
  async get(): Promise<TopSellingProductsResponse> {
    const results = await OrderItem.findAll({
      attributes: [
        [col('variant.product.product_name'), 'product'],
        [fn('SUM', col('quantity')), 'sales'],
      ],
      include: [
        {
          model: ProductVariant,
          as: 'variant',
          attributes: [], // we only want the name, already selected above
          include: [
            {
              model: Product,
              as: 'product',
              attributes: []
            }
          ]
        },
      ],
      group: ['variant.product.product_name'],
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