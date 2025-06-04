import { BaseQueryDto } from '@/app/common/dto/base-query.dto';
import { Pagination } from '@/app/common/interfaces/api.interface';
import Category from '@/app/models/category/category.model';
import ProductImage from '@/app/models/product/product-images.model';
import ProductRating from '@/app/models/product/product-rating.model';
import Product from '@/app/models/product/product.model';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import { toProductManagementDetailResponse, toProductManagementDisplayResponse } from './map';
import { databaseConstants } from '@/app/common/constants/database.constants';
import Brand from '@/app/models/brand/brand.model';
import Color from '@/app/models/product/color.model';
import Size from '@/app/models/product/size.model';
import ProductVariantStatus from '@/app/models/product/product-variants-status.model';
import Label from '@/app/models/product/label.model';
import Tag from '@/app/models/product/tag.model';
import Ingredient from '@/app/models/product/ingredient.model';
import CareInstruction from '@/app/models/product/care-instruction.model';
import UsageInstruction from '@/app/models/product/usage-instruction.model';
import { CreateProductManagementDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import sequelizeConfig from '@/config/sequelize.config';
import ProductDimension from '@/app/models/product/dimension.model';
import { EncodedService } from '@/app/common/services/encode.service';
import ProductVariant from '@/app/models/product/product-variants.model';


@Injectable()
export class ProductManagementService {

    private readonly _encode_service: EncodedService
    constructor() {
        this._encode_service = new EncodedService('public/uploads/products')
    }

    async setup() {
        try {
            const [
                categories,
                brands,
                colors,
                sizes,
                statuses,
                product_labels,
                product_tags,
                ingredients,
                care_instructions,
                usage_instructions,
                status,
            ] = await Promise.all([
                Category.findAll({ attributes: [['category_id', 'id'], ['category_name', 'label']] }),
                Brand.findAll({ attributes: [['brand_id', 'id'], ['brand_name', 'label']] }),
                Color.findAll({ attributes: [['id', 'id'], ['name', 'label']] }),
                Size.findAll({ attributes: [['id', 'id'], ['name', 'label']] }),
                ProductVariantStatus.findAll({ attributes: [['id', 'id'], ['label', 'label']] }),
                Label.findAll({ attributes: [['id', 'id'], ['name', 'label']] }),
                Tag.findAll({ attributes: [['id', 'id'], ['name', 'label']] }),
                Ingredient.findAll({ attributes: [['id', 'id'], ['name', 'label']] }),
                CareInstruction.findAll({ attributes: [['id', 'id'], ['instruction', 'label']] }),
                UsageInstruction.findAll({ attributes: [['id', 'id'], ['instruction', 'label']] }),
                ProductVariantStatus.findAll({ attributes: [['id', 'id'], ['label', 'label']] })
            ]);

            return {
                categories,
                brands,
                colors,
                sizes,
                statuses,
                product_labels,
                product_tags,
                ingredients,
                care_instructions,
                usage_instructions,
                status
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    async get(query: BaseQueryDto) {
        try {
            const DEFAULT_PAGE = 1;
            const DEFAULT_LIMIT = 10;

            const page = query.page ? query.page : DEFAULT_PAGE;
            const limit = query.limit ? query.limit : DEFAULT_LIMIT;

            const offset = (page - 1) * limit;

            const sortKey = query.sort ?? 'product_id';
            const sortOrder: 'asc' | 'desc' = query.order ?? 'asc';

            // Define a clean type-safe sort config
            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['product_id', sortOrder],
                name: ['product_name', sortOrder],
                category: [{ model: Category, as: 'category' }, 'category_name', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
            };

            const order: OrderItem[] = SORT_CONFIG[sortKey]
                ? [SORT_CONFIG[sortKey]]
                : [['product_id', 'asc']];


            // search
            const likeOperator = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

            const search = query.search;

            const whereClause = search ? {
                [Op.or]: [
                    {
                        product_name: { [likeOperator]: `%${search}%` },
                    }
                ],
            } : {};


            const { rows: prodcuts, count } = await Product.findAndCountAll({
                attributes: [
                    'product_id', 'product_name', 'price', 'expiry_date',
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
                    [
                        Sequelize.literal(`(
                            SELECT SUM(stock)
                            FROM product_variants AS pv
                            WHERE pv.product_id = "Product".product_id
                        )`),
                        'stock_count'
                    ]
                ],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_id', 'image_url', 'is_main'],
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
                        attributes: ['category_name']
                    },
                ],
                limit,
                offset,
                order,
                where: whereClause,
                distinct: true,
            });

            const pagination: Pagination = {
                current_page: page,
                page_size: limit,
                total_items: count,
                total_pages: Math.ceil(count / limit)
            }
            return {
                products: prodcuts.map(p => toProductManagementDisplayResponse(p)),
                pagination: pagination
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async create(body: CreateProductManagementDto, creator: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const manufacturing_date = new Date(body.manufacturing_date);
            const expiry_date = new Date(body.expiry_date);

            // create dimension
            const dimension = await ProductDimension.create({
                ...body.dimension,
                creator_id: creator.id
            }, { transaction });
            if (!dimension) {
                throw new BadRequestException('Failed to create dimension')
            }
            const product = await Product.create({
                product_name: body.product_name,
                slug: body.slug,
                price: body.price,
                discount: body.discount,
                description: body.description,
                short_description: body.short_description,
                manufacturing_date: manufacturing_date,
                expiry_date: expiry_date,
                return_policy: body.return_policy,
                brand_id: body.brand_id,
                category_id: body.category_id,
                dimension_id: dimension.id,
                creator_id: creator.id
            }, { transaction });

            if (!product) {
                throw new BadRequestException('Faild to create a new product')
            }

            // link relationship

            // save images
            if (body.images?.length) {
                await Promise.all(
                    body.images.map(async (image, index) => {
                        if (!this._encode_service.isBase64Image(image)) {
                            throw new BadRequestException('Invalid format image')
                        };
                        const is_main = index === 0;
                        const iamge_path = await this._encode_service.saveBase64Image(image);
                        const image_product = await ProductImage.create({
                            image_url: iamge_path,
                            is_main: is_main,
                            product_id: product.product_id,
                            creator_id: creator.id
                        }, { transaction })
                        return image_product
                    })
                )
            }

            // product variants
            if (body.product_variants?.length) {
                await Promise.all(
                    body.product_variants.map(async (variant) => {
                        const variant_product = await ProductVariant.create({
                            ...variant,
                            product_id: product.product_id,
                            creator_id: creator.id
                        }, { transaction })
                        if (!variant_product) {
                            throw new BadRequestException('Failed to create variant_product')
                        }
                        return variant_product
                    })
                )
            }

            // tag 
            if (body.tagIds?.length) {
                await product.$set('tags', body.tagIds, { transaction })
            }
            // ingredient
            if (body.ingredientIds?.length) {
                await product.$set('ingredients', body.ingredientIds, { transaction });
            }
            //   careInstructionIds: [ 1 ],
            if (body.careInstructionIds?.length) {
                await product.$set('care_instructions', body.careInstructionIds, { transaction })
            }
            //   usageInstructionIds: [ 4, 6 ],
            if (body.usageInstructionIds?.length) {
                await product.$set('usage_instructions', body.usageInstructionIds, { transaction })
            }
            //   labelIds: [ 1, 2 ]
            if (body.labelIds?.length) {
                await product.$set('labels', body.labelIds, { transaction })
            }

            await transaction.commit();
            return product;
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number) {
        try {
            const product = await Product.findOne({
                where: {
                    product_id: id
                },
                attributes: [
                    'product_id',
                    'product_name',
                    'slug',
                    'price',
                    'discount',
                    'description',
                    'short_description',
                    'manufacturing_date',
                    'expiry_date',
                    'return_policy',
                    'created_at',
                    'updated_at',
                    'brand_id',
                    'category_id',
                    [
                        Sequelize.literal(`(
                                SELECT COALESCE(AVG(rating), 0)
                                FROM product_ratings AS rating
                                WHERE rating.product_id = "Product".product_id
                            )`),
                        'rating_avg',
                    ],
                    [
                        Sequelize.literal(`(
                                SELECT COALESCE(COUNT(rating), 0)
                                FROM product_ratings AS rating
                                WHERE rating.product_id = "Product".product_id
                            )`),
                        'rating_count',
                    ],
                    [
                        Sequelize.literal(`(
                                SELECT COALESCE(SUM(stock), 0)
                                FROM product_variants as pv
                                WHERE pv.product_id = "Product".product_id
                            )`),
                        'stock_count'
                    ],
                ],
                include: [
                    {
                        model: Brand,
                        as: 'brand',
                        attributes: ['brand_name'],
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['category_name'],
                    },
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_id', 'image_url', 'is_main'],
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                    },
                    {
                        model: Ingredient,
                        as: 'ingredients',
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                    },
                    {
                        model: CareInstruction,
                        as: 'care_instructions',
                        attributes: ['id', 'instruction'],
                        through: { attributes: [] },
                    },
                    {
                        model: UsageInstruction,
                        as: 'usage_instructions',
                        attributes: ['id', 'instruction'],
                        through: { attributes: [] },
                    },
                    {
                        model: Label,
                        attributes: ['name'],
                        through: { attributes: [] },
                    },
                    {
                        model: ProductVariant,
                        attributes: ['variant_id', 'color_id', 'size_id', 'price', 'discount', 'stock', 'sku', 'status_id'],
                        include: [
                            {
                                model: Color,
                                attributes: ['id', 'name'],
                            },
                            {
                                model: Size,
                                attributes: ['id', 'name'],
                            },
                            {
                                model: ProductVariantStatus,
                                attributes: ['id', 'label']
                            }
                        ],
                    },
                    {
                        model: ProductDimension,
                        attributes: ['dimension_label', 'width', 'height', 'depth', 'weight']
                    },
                ],
            })
            return toProductManagementDetailResponse(product)
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async update(id: number, body: CreateProductManagementDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const product = await Product.findByPk(id, {
                include: [ProductDimension],
            });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Update dimension
            if (product.dimension_id) {
                await ProductDimension.update(
                    {
                        ...body.dimension,
                        updater_id: updater.id
                    },
                    {
                        where: { id: product.dimension_id },
                        transaction,
                    }
                );
            }

            // Update product
            const manufacturing_date = new Date(body.manufacturing_date);
            const expiry_date = new Date(body.expiry_date);

            await product.update(
                {
                    product_name: body.product_name,
                    slug: body.slug,
                    price: body.price,
                    discount: body.discount,
                    description: body.description,
                    short_description: body.short_description,
                    manufacturing_date,
                    expiry_date,
                    return_policy: body.return_policy,
                    brand_id: body.brand_id,
                    category_id: body.category_id,
                    updater_id: updater.id,
                },
                { transaction }
            );

            // Replace images
            if (body.images?.length) {
                await ProductImage.destroy({
                    where: { product_id: product.product_id },
                    transaction,
                    force: true
                });

                await Promise.all(
                    body.images.map(async (image, index) => {
                        if (!this._encode_service.isBase64Image(image)) {
                            throw new BadRequestException('Invalid format image');
                        }

                        const is_main = index === 0;
                        const image_path = await this._encode_service.saveBase64Image(image);

                        await ProductImage.create(
                            {
                                image_url: image_path,
                                is_main,
                                product_id: product.product_id,
                                creator_id: updater.id
                            },
                            { transaction }
                        );
                    })
                );
            }

            // Replace product variants
            if (body.product_variants?.length) {
                await ProductVariant.destroy({
                    where: { product_id: product.product_id },
                    transaction,
                    force: true
                });

                await Promise.all(
                    body.product_variants.map(async (variant) => {
                        await ProductVariant.create(
                            {
                                ...variant,
                                product_id: product.product_id,
                                creator_id: updater.id,
                            },
                            { transaction }
                        );
                    })
                );
            }

            // Update associations
            if (body.tagIds) {
                await product.$set('tags', body.tagIds, { transaction });
            }
            if (body.ingredientIds) {
                await product.$set('ingredients', body.ingredientIds, { transaction });
            }
            if (body.careInstructionIds) {
                await product.$set('care_instructions', body.careInstructionIds, { transaction });
            }
            if (body.usageInstructionIds) {
                await product.$set('usage_instructions', body.usageInstructionIds, { transaction });
            }
            if (body.labelIds) {
                await product.$set('labels', body.labelIds, { transaction });
            }

            await transaction.commit();
            return product;
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number, deleter: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const product = await Product.findByPk(id, { transaction });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Set deleter_id then delete product
            await product.update({ deleter_id: deleter.id }, { transaction });
            await product.destroy({ transaction });

            await transaction.commit();
            return { message: 'Product deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }
}