import { Injectable, BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import Product from '@/app/models/product/product.model';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import ProductImage from '@/app/models/product/images.model';
import { ProductDisplayResponse } from '@/app/common/interfaces/product.interface';
import { toProductDisplayResponse } from '@/app/common/utils/helper/product.map';


@Injectable()
export class ProductEventService {
    async get(): Promise<ApiResponse<{
        top_rating: ProductDisplayResponse[];
        trending: ProductDisplayResponse[];
        recommended: ProductDisplayResponse[];
        best_deal: ProductDisplayResponse[];
        three_row_listing_product: ProductDisplayResponse[];
    }>> {
        try {
            const top_rating = await Product.findAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating'],
                where: {
                    rating: {
                        [Op.gte]: 4.5
                    }
                },
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url']
                    },
                ],
                limit: 10,
                order: [['rating', 'DESC']]
            });

            const trending = await Product.findAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating', 'rating_count'],
                where: { rating_count: { [Op.gte]: 50 } },
                include: [
                    { 
                        model: ProductImage, 
                        as: 'images' ,
                        attributes: ['image_url']
                    },
                ],
                limit: 10,
                order: [['rating_count', 'DESC']]
            });

            const recommended = await Product.findAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating', 'updated_at'],
                where: { is_featured: true },
                include: [
                    { 
                        model: ProductImage, 
                        as: 'images',
                        attributes: ['image_url']
                    },
                ],
                limit: 10,
                order: [['updated_at', 'DESC']]
            });

            const best_deal = await Product.findAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating'],
                where: { discount: { [Op.not]: null } },
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url']
                    },
                ],
                limit: 10,
                order: [['discount', 'DESC']]
            });

            const three_row_listing_product = await Product.findAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating'],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url']
                    },
                ],
                limit: 9,
            })

            return {
                message: 'Product events fetched successfully',
                data: {
                    top_rating: top_rating.map(toProductDisplayResponse),
                    trending: trending.map(toProductDisplayResponse),
                    recommended: recommended.map(toProductDisplayResponse),
                    best_deal: best_deal.map(toProductDisplayResponse),
                    three_row_listing_product: three_row_listing_product.map(toProductDisplayResponse)
                },
            };
        } catch (error) {
            console.error('Error fetching product events:', error);
            throw new BadRequestException('Error fetching product events');
        }
    }
}