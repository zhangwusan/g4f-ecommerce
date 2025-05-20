import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, OrderItem } from 'sequelize';
import Category from '@/app/models/category/category.model';
import { buildFilterClause, buildSearchClause, buildSortClause, buildTagsClause, combineWhereClauses } from '@/app/common/utils/helper/query.helper';
import Product from '@/app/models/product/product.model';
import ProductImage from '@/app/models/product/images.model';
import { toProductDisplayResponse } from '@/app/common/utils/helper/product.map';
import { databaseConstants } from '@/app/common/constants/database.constants';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import { ProductDisplayResponse } from '@/app/common/interfaces/product.interface';

@Injectable()
export class CategoryService {

    async setup() {
        const sorts = [
            { value: 'price', label: 'Price' },
            { value: 'rating', label: 'Rating' },
            { value: 'title', label: 'Title' }
        ];
        const order = [
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' }
        ];

        try {
            // Get all categories
            const categories = await Category.findAll({
                attributes: ['category_id', 'category_name']
            });
            return {
                message: 'Fetching successfully.',
                data: {
                    categories,
                    sorts,
                    order
                }
            };
        } catch (error) {
        }
    }

    async get_data(params: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        search?: string;
        filter?: Record<string, string>;
        tags?: string[];
    }) {
        console.log(params)
        try {
            const page = params.page ?? 1;
            const limit = params.limit ?? 10;
            const offset = (page - 1) * limit;

            const searchClause = buildSearchClause(params.search ?? '', [
                'category_name',
            ]);

            const filterClause = buildFilterClause(params.filter ?? {}, {
                name: 'category_name',
            });

            const tagsClause = buildTagsClause(params.tags);

            const whereClause = combineWhereClauses(searchClause, filterClause, tagsClause);


            // build filter
            const sortKey = params.sort ?? 'created';
            const sortOrder: 'asc' | 'desc' = params.order ?? 'desc';
            const SORT_CONFIG: Record<string, OrderItem> = {
                category_id: ['category_id', sortOrder],
                category_name: ['category_name', sortOrder],
                title: [{ model: Product, as: 'products' }, 'product_name', sortOrder],
                price: [{ model: Product, as: 'products' }, 'price', sortOrder],
                rating: [{ model: Product, as: 'products' }, 'rating', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
            };
            const order: OrderItem[] = SORT_CONFIG[sortKey] ? [SORT_CONFIG[sortKey]] : [['created_at', 'desc']];



            const { rows, count } = await Category.findAndCountAll({
                attributes: ['category_id', 'category_name', 'description', 'created_at', 'updated_at'],
                where: whereClause,
                include: [
                    {
                        model: Product,
                        attributes: ['product_id', 'product_name', 'price', 'discount', 'rating'],
                        include: [
                            {
                                model: ProductImage,
                                as: 'images',
                                attributes: ['image_url']
                            }
                        ]
                    }
                ],
                order,
                limit,
                offset,
            });

            return {
                message: 'Categories fetched successfully.',
                data: rows.map(category => ({
                    category_id: category.category_id,
                    category_name: category.category_name,
                    discription: category.description,
                    created_at: category.created_at,
                    updated_at: category.updated_at,
                    products: category.products.map(toProductDisplayResponse)
                })),
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total_page: Math.ceil(count / limit),
                    total_items: count,
                },
            };

        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message)
        }
    }

    async get_product_by_category_name(category_name: string, params: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        search?: string;
    }) : Promise<ApiResponse<ProductDisplayResponse[]>>{
        try {
            const page = params.page ?? 1;
            const limit = params.limit ?? 10;
            const offset = (page - 1) * limit;
            const search = params.search ?? '';
            const sortKey = params.sort ?? 'created';
            const sortOrder: 'asc' | 'desc' = params.order ?? 'desc';

            // Sorting
            const SORT_CONFIG: Record<string, OrderItem> = {
                title: ['product_name', sortOrder],
                price: ['price', sortOrder],
                rating: ['rating', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
            };
            const order: OrderItem[] = SORT_CONFIG[sortKey] ? [SORT_CONFIG[sortKey]] : [['created_at', 'desc']];

            // Searching
            const likeOperator = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

            const whereClause = search
                ? {
                    [Op.or]: [
                        {
                            product_name: {
                                [likeOperator]: `%${search}%`,
                            },
                        }
                    ],
                }
                : {};


            const { rows: products, count } = await Product.findAndCountAll({
                attributes: ['product_id', 'product_name', 'price', 'discount', 'rating'],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url']
                    },
                    {
                        model: Category,
                        attributes: [],
                        where: {
                            category_name: category_name
                        }
                    }
                ],
                limit: limit,
                offset: offset,
                order: order,
                where: whereClause,
                distinct: true,
            })

            return {
                message: 'Categories fetched successfully.',
                data: products.map(toProductDisplayResponse),
                pagination: {
                    current_page: page,
                    page_size: limit,
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                },
            };

        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }
    }
}