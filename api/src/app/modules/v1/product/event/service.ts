import { Injectable, BadRequestException } from '@nestjs/common';
import { col, fn, literal, Op } from 'sequelize';
import Product from '@/app/models/product/product.model';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import ProductImage from '@/app/models/product/product-images.model';
import { ProductDisplayResponse } from '@/app/common/interfaces/product.interface';
import { toProductDisplayResponse } from '@/app/common/utils/helper/product.map';
import ProductRating from '@/app/models/product/product-rating.model';
import Label from '@/app/models/product/label.model';
import ProductLabel from '@/app/models/product/product-label.model';


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
                attributes: [
                    'product_id',
                    'product_name',
                    'price',
                    'discount',
                    [fn('AVG', col('ratings.rating')), 'rating_avg'],
                    [fn('COUNT', col('ratings.rating')), 'rating_count'],
                ],
                include: [
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url', 'image_id'],
                        where: { is_main: true },
                        required: false
                    }
                ],
                group: ['Product.product_id', 'images.image_id'],
                order: [[literal('"rating_avg"'), 'DESC']],
                limit: 10,
                subQuery: false
            });

            const trending = await Product.findAll({
                attributes: [
                    'product_id',
                    'product_name',
                    'price',
                    'discount',
                    [fn('COUNT', col('ratings.rating')), 'rating_count'],
                    [fn('AVG', col('ratings.rating')), 'rating_avg'],
                ],
                include: [
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url', 'image_id'],
                        where: { is_main: true },
                        required: false
                    }
                ],
                group: ['Product.product_id', 'images.image_id'],
                having: literal(`COUNT("ratings"."rating") >= 40`),
                order: [[literal('"rating_count"'), 'DESC']],
                limit: 10,
                subQuery: false
            });

            const recommended = await Product.findAll({
                attributes: [
                    'product_id',
                    'product_name',
                    'price',
                    'discount',
                    'updated_at',
                    [fn('AVG', col('ratings.rating')), 'rating_avg'],
                    [fn('COUNT', col('ratings.rating')), 'rating_count'],
                ],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url', 'image_id'],
                        where: { is_main: true },
                        required: false,
                    },
                    {
                        model: Label,
                        attributes: [],
                        through: { attributes: [] },
                        where: { name: 'featured' },
                        required: true,
                        duplicating: false,
                    },
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false,
                    },
                ],
                group: ['Product.product_id', 'images.image_id'],
                order: [['updated_at', 'DESC']],
                limit: 10,
                subQuery: false,
            });

            const best_deal = await Product.findAll({
                attributes: [
                    'product_id',
                    'product_name',
                    'price',
                    'discount',
                    [fn('AVG', col('ratings.rating')), 'rating_avg'],
                    [fn('COUNT', col('ratings.rating')), 'rating_count'],
                ],
                where: {
                    discount: {
                        [Op.not]: null,
                    },
                },
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url', 'image_id'],
                        where: { is_main: true },
                        required: false,
                    },
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false,
                    },
                ],
                group: ['Product.product_id', 'images.image_id'],
                order: [['discount', 'DESC']],
                limit: 10,
                subQuery: false,
            });

            const three_row_listing_product = await Product.findAll({
                attributes: [
                    'product_id',
                    'product_name',
                    'price',
                    'discount',
                    [fn('AVG', col('ratings.rating')), 'rating_avg'],
                    [fn('COUNT', col('ratings.rating')), 'rating_count'],
                ],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url', 'image_id'],
                        where: { is_main: true },
                        required: false,
                    },
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false,
                    },
                ],
                group: ['Product.product_id', 'images.image_id'],
                limit: 9,
                subQuery: false,
            });

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