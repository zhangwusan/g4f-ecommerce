import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import Category from '@/app/models/category/category.model';
import { buildFilterClause, buildSearchClause, buildSortClause, buildTagsClause, combineWhereClauses } from '@/app/common/utils/helper/query.helper';
import Product from '@/app/models/product/product.model';
import ProductImage from '@/app/models/product/product-images.model';
import { toProductDisplayResponse } from '@/app/common/utils/helper/product.map';
import { databaseConstants } from '@/app/common/constants/database.constants';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import { ProductDisplayResponse } from '@/app/common/interfaces/product.interface';
import ProductRating from '@/app/models/product/product-rating.model';
import { CreateCategoryDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import sequelizeConfig from '@/config/sequelize.config';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

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
            const sortKey = params.sort ?? 'id';
            const sortOrder: 'asc' | 'desc' = params.order ?? 'asc';
            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['category_id', sortOrder],
                name: ['category_name', sortOrder],
                title: [{ model: Product, as: 'products' }, 'product_name', sortOrder],
                price: [{ model: Product, as: 'products' }, 'price', sortOrder],
                created_at: ['created_at', sortOrder],
                updated_at: ['updated_at', sortOrder],
            };
            const order: OrderItem[] = [SORT_CONFIG[sortKey]];


            const { rows, count } = await Category.findAndCountAll({
                attributes: ['category_id', 'category_name', 'description', 'created_at', 'updated_at'],
                where: whereClause,
                include: [
                    {
                        model: Product,
                        as: 'products',
                        attributes: [
                            'product_id',
                            'product_name',
                            'price',
                            'discount',
                            [
                                Sequelize.literal(`(
                                    SELECT AVG(rating)
                                    FROM product_ratings AS pr
                                    WHERE pr.product_id = "products"."product_id"
                                    )`),
                                'rating_avg',
                            ],
                            [
                                Sequelize.literal(`(
                                    SELECT COUNT(rating)
                                    FROM product_ratings AS pr
                                    WHERE pr.product_id = "products"."product_id"
                                    )`),
                                'rating_count',
                            ],
                        ],
                        include: [
                            {
                                model: ProductImage,
                                as: 'images',
                                attributes: ['image_url'],
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
                    },
                ],
                order,   // Assumed to be defined somewhere
                limit,   // Pagination
                offset,  // Pagination
                distinct: true, // Important when using include to ensure correct count
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

    async get(query: BaseQueryDto) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const offset = (page - 1) * limit;
            const sortKey = query.sort || 'id';
            const sortOrder = query.order || 'asc';
            const search = query.search || '';

            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['category_id', sortOrder],
                name: ['category_name', sortOrder],
            };

            const order: OrderItem[] = [SORT_CONFIG[sortKey]];

            const whereClause = search
                ? {
                    instruction: {
                        [Op.iLike]: `%${search}%`, // Use Op.like for MySQL
                    },
                }
                : {};

            const { rows: data, count } = await Category.findAndCountAll({
                attributes: ['category_id', 'category_name', 'created_at', 'updated_at'],
                where: whereClause,
                order,
                limit,
                offset,
            });

            return {
                message: 'Category fetched successfully.',
                data: data.map(b => ({
                    id: b.category_id,
                    name: b.category_name,
                    created_at: b.created_at.toLocaleString(),
                    updated_at: b.created_at.toLocaleString(),
                })),
                pagination: {
                    current_page: +page,
                    per_page: +limit,
                    total_page: Math.ceil(count / limit),
                    total_items: count,
                },
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number) {
        try {
            const category = await Category.findByPk(id, {
                attributes: ['category_id', 'category_name', 'description', 'created_at', 'updated_at'],
            });

            if (!category) {
                throw new BadRequestException('Category not found');
            }

            const sanitizedCategory = {
                category_id: category.category_id ?? 'N/A',
                category_name: category.category_name ?? 'N/A',
                description: category.description ?? 'N/A',
                created_at: category.created_at ?? 'N/A',
                updated_at: category.updated_at ?? 'N/A',
            };
            return sanitizedCategory;
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async get_product_by_category_name(category_name: string, params: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        search?: string;
    }): Promise<ApiResponse<ProductDisplayResponse[]>> {
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
                rating: [{ model: ProductRating, as: 'ratings' }, 'rating', sortOrder],
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
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url'],
                        where: { is_main: true },
                        required: false,
                    },
                    {
                        model: ProductRating,
                        as: 'ratings',
                        attributes: [],
                        required: false,
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: [],
                        where: category_name ? { category_name } : undefined,
                        required: !!category_name,
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        [
                            Sequelize.literal(`(
                                SELECT AVG(rating)
                                FROM product_ratings AS rating
                                WHERE rating.product_id = "Product".product_id
                            )`),
                            'rating_avg',
                        ],
                        [
                            Sequelize.literal(`(
                                SELECT COUNT(rating)
                                FROM product_ratings AS rating
                                WHERE rating.product_id = "Product".product_id
                            )`),
                            'rating_count',
                        ],
                    ],
                },
                order,
                limit,
                offset,
                where: whereClause,
                distinct: true,
            });

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

    async create(body: CreateCategoryDto, creator: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            // Find existing instruction, including soft-deleted
            const existing = await Category.findOne({
                where: { category_name: body.category_name },
                paranoid: false,
                transaction,
            });

            if (existing) {
                if (existing.deleted_at) {
                    await existing.restore({ transaction });
                    existing.creator_id = creator.id;
                    await existing.save({ transaction });
                    await transaction.commit();
                    return existing;
                } else {
                    throw new BadRequestException('Instruction already exists');
                }
            }

            const instruction = await Category.create(
                {
                    category_name: body.category_name,
                    creator_id: creator.id,
                },
                { transaction },
            );

            await transaction.commit();
            return instruction;
        } catch (error) {
            await transaction.rollback();
            throw error instanceof BadRequestException
                ? error
                : new BadRequestException(error.message);
        }
    }

    async update(id: number, body: CreateCategoryDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new BadRequestException('Category not found');
            }

            await category.update(
                {
                    category_name: body.category_name,
                    description: body.description,
                    updater_id: updater.id,
                },
                { transaction },
            );

            await transaction.commit();
            return category;
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number, deleter: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new BadRequestException('Category not found');
            }

            await category.update({
                deleter_id: deleter.id
            });

            await category.destroy({ transaction });

            await transaction.commit();
            return { message: 'Category deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }
}