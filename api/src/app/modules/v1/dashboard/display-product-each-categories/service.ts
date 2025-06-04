import Category from '@/app/models/category/category.model';
import Product from '@/app/models/product/product.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { col, fn } from 'sequelize';
import { DisplayProductEachCategoriesResponse } from './interface';

@Injectable()
export class DisplayProductEachCategoriesService {
    async get(): Promise<DisplayProductEachCategoriesResponse> {

        try {
            const result: any[] = await Product.findAll({
                attributes: [
                    [col('category.category_name'), 'category'], 
                    [fn('COUNT', col('product_id')), 'count'],
                ],
                include: [
                    {
                        model: Category,
                        attributes: [], // we already select category_name above
                    },
                ],
                group: ['category.category_id', 'category.category_name'],
                raw: true,
            });
            return {
                title: 'Product Distribution by Category',
                description: 'Total number of products available in each category',
                data: result.map(data => ({
                    category: data.category,
                    count: +data.count
                })),
                total: result.reduce((acc, item) => acc + Number(item.count), 0)
            }


        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }
    }
}