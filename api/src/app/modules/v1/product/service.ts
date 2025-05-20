import Product from '@/app/models/product/product.model';
import Brand from '@/app/models/brand/brand.model';
import Category from '@/app/models/category/category.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import { databaseConstants } from '@/app/common/constants/database.constants';
import Tag from '@/app/models/product/tag.model';
import Color from '@/app/models/product/color.model';
import Size from '@/app/models/product/size.model';
import Ingredient from '@/app/models/product/ingredient.model';
import CareInstruction from '@/app/models/product/care-instruction.model';
import UsageInstruction from '@/app/models/product/usage-instruction.model';
import ProductImage from '@/app/models/product/images.model';
import { toProductDisplayResponse, toProductResponse } from '@/app/common/utils/helper/product.map';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import { ProductDisplayResponse, ProductResponse } from '@/app/common/interfaces/product.interface';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import Cart from '@/app/models/cart/cart.model';
import User from '@/app/models/user/user.model';
import CartItem from '@/app/models/cart/cart-item.model';
import sequelizeConfig from '@/config/sequelize.config';
import ProductVariant from '@/app/models/product/product-variants.model';

@Injectable()
export class ProductService {
    async get_data(params: {
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

            // Define a clean type-safe sort config
            const SORT_CONFIG: Record<string, OrderItem> = {
                product_name: ['product_name', sortOrder],
                price: ['price', sortOrder],
                stock: ['stock_quantity', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
                'brand_id': [{ model: Brand, as: 'brand' }, 'brand_id', sortOrder],
                'brand_name': [{ model: Brand, as: 'brand' }, 'brand_name', sortOrder],
                'category_name': [{ model: Category, as: 'category' }, 'category_name', sortOrder],
            };

            const order: OrderItem[] = SORT_CONFIG[sortKey]
                ? [SORT_CONFIG[sortKey]]
                : [['created_at', 'desc']];

            const likeOperator = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

            const whereClause = search
                ? {
                    [Op.or]: [
                        {
                            product_name: {
                                [likeOperator]: `%${search}%`,
                            },
                        },
                        {
                            '$brand.brand_name$': {
                                [likeOperator]: `%${search}%`,
                            },
                        },
                        {
                            '$category.category_name$': {
                                [likeOperator]: `%${search}%`,
                            },
                        },
                    ],
                }
                : {};

            const { rows, count } = await Product.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['image_url'],
                    },
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                order,
                limit,
                offset,
                distinct: true,
            });
            if (!rows) {
                throw new BadRequestException('No products found.');
            }
            if (rows.length === 0) {
                return {
                    message: 'No products found.',
                    data: [],
                    pagination: {
                        current_page: page,
                        page_size: limit,
                        total_pages: 0,
                        total_items: 0,
                    },
                };
            }

            return {
                message: 'Products fetched successfully.',
                data: rows.map(toProductDisplayResponse),
                pagination: {
                    current_page: page,
                    page_size: limit,
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                },
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number): Promise<ApiResponse<ProductResponse>> {
        try {
            const product = await Product.findOne({
                where: {
                    product_id: id
                },
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
                        attributes: ['image_url'],
                    },
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'name'],
                        through: { attributes: [] }, // removes join table data
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
                        model: ProductVariant,
                        attributes: ['variant_id', 'color_id', 'size_id'],
                        include: [
                            {
                                model: Color,
                                attributes: ['id', 'name'],
                            },
                            {
                                model: Size,
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            });

            if (!product) {
                throw new BadRequestException('Product not found.');
            }

            return {
                message: 'Product fetched successfully.',
                data: toProductResponse(product),
            };

        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async update_product_and_clean_cart(user_dec: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const cartItems = await CartItem.findAll({
                attributes: ['cart_item_id', 'quantity', 'product_id', 'color_id', 'size_id'],
                include: [
                    {
                        model: Cart,
                        attributes: [],
                        include: [
                            {
                                model: User,
                                attributes: [],
                                where: { id: user_dec.id },
                            },
                        ],
                    },
                ],
                transaction,
            });

            for (const item of cartItems) {
                const variant = await ProductVariant.findOne({
                    where: {
                        product_id: item.product_id,
                        color_id: item.color_id,
                        size_id: item.size_id,
                    },
                    transaction,
                });

                if (!variant) {
                    throw new BadRequestException(`Variant not found for product ${item.product_id}`);
                }

                if (variant.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for variant (Product: ${item.product_id}, Color: ${item.color_id}, Size: ${item.size_id})`);
                }

                variant.stock -= item.quantity;
                await variant.save({ transaction });
            }

            // Clean up the cart
            const cartItemIds = cartItems.map(item => item.cart_item_id);
            await CartItem.destroy({ where: { cart_item_id: cartItemIds }, transaction });
            await Cart.destroy({ where: { user_id: user_dec.id }, transaction });

            await transaction.commit();

            return {
                message: 'Inventory updated and cart cleared.',
                updated: cartItems.map(item => ({
                    productId: item.product_id,
                    colorId: item.color_id,
                    sizeId: item.size_id,
                    quantity: item.quantity,
                })),
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Inventory update failed:', error);
            throw new BadRequestException(error.message);
        }
    }
}