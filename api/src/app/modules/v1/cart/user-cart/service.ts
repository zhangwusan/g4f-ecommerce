import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { ApiResponse } from '@/app/common/interfaces/api.interface';
import { CartItemResponse } from '@/app/common/interfaces/cart.interface';
import CartItem from '@/app/models/cart/cart-item.model';
import Cart from '@/app/models/cart/cart.model';
import Product from '@/app/models/product/product.model';
import sequelizeConfig from '@/config/sequelize.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Sequelize, Transaction } from 'sequelize';
import { AddToCartRequest } from './dto';
import Color from '@/app/models/product/color.model';
import Size from '@/app/models/product/size.model';
import ProductImage from '@/app/models/product/images.model';

@Injectable()
export class UserCartService {

  async add(
    body: AddToCartRequest,
    user: UserDecoratorType
  ) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction: Transaction = await sequelize.transaction()
    try {
      // extract data from request body
      const { product_id, quantity, discount, color, size } = body;

      // find product by id
      const product = await Product.findByPk(product_id);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      // Find or create the user's cart
      let cart = await Cart.findOne({
        where: { user_id: user.id },
        transaction,
      });

      if (!cart) {
        cart = await Cart.create({ user_id: user.id }, { transaction });
      }

      // Check if item already exists in cart 
      const existingCartItem = await CartItem.findOne({
        where: {
          cart_id: cart.id,
          product_id: product_id,
          color_id: color,
          size_id: size,
        },
        transaction,
      });

      if (existingCartItem) {
        existingCartItem.quantity = quantity;
        await existingCartItem.save({ transaction });
      } else {
        // Add new cart item
        await CartItem.create({
          cart_id: cart.id,
          product_id: product_id,
          quantity: quantity,
          discount: discount,
          color_id: color,
          size_id: size,
        }, { transaction });
      }

      await transaction.commit();
      return { message: 'Item added to cart successfully' };

    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw new BadRequestException(error.message || 'Failed to add item to cart');
    }
  }


  async get(user: UserDecoratorType): Promise<ApiResponse<CartItemResponse[]>> {
    try {
      const { id } = user;

      // validate cart
      const exist_cart = await Cart.findOne({
        attributes: ['id'],
        where: {
          user_id: id
        }
      });
      
      if(!exist_cart) {
        await Cart.create({
          user_id: id
        })
      }

      const cart = await Cart.findOne({
        where: { user_id: id },
        attributes: ['id', 'user_id', 'created_at', 'updated_at'],
        include: [
          {
            model: CartItem,
            attributes: ['cart_item_id', 'cart_id', 'quantity', 'discount'],
            as: 'cart_items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['product_id', 'product_name', 'price'],
                include: [
                  {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['image_url']
                  }
                ]
              },
              {
                model: Color,
                as: 'color',
                attributes: ['name'],
              },
              {
                model: Size,
                as: 'size',
                attributes: ['name']
              }
            ]
          }
        ],
        order: [
          [{ model: CartItem, as: 'cart_items' }, 'cart_item_id', 'DESC']
        ],
      })

      // Check if the cart is empty
      if (cart.cart_items.length === 0) {
        return {
          message: 'Cart is empty.',
          data: [],
        }
      }

      // Map the cart items to the desired response format
      const cartItems: CartItemResponse[] = cart.cart_items.map((item) => {
        return {
          id: item.cart_item_id,
          product_id: item.product.product_id,
          name: item.product.product_name,
          image: item.product.images[0].image_url || '',
          price: item.product.price,
          quantity: item.quantity,
          discount: item.discount,
          color: item.color.name,
          size: item.size.name,
          date: item.createdAt,
        }
      });

      return {
        message: 'Cart fetched successfully.',
        data: cartItems,
      }


    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async patch(cartItemId: number, quantity: number, user: UserDecoratorType): Promise<ApiResponse> {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { id } = user;
      const cart_item = await CartItem.findOne({
        where: { cart_item_id: cartItemId },
        include: [
          {
            model: Cart,
            as: 'cart',
            where: { user_id: id },
          }
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart_item) {
        throw new BadRequestException('Cart item not found');
      }

      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      // Update the quantity of the cart item
      cart_item.quantity = quantity;

      cart_item.quantity = quantity;
      await cart_item.save({ transaction });

      await transaction.commit();


      return {
        message: 'Cart item updated successfully.',
      };
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async delete(cartItemId: number, user: UserDecoratorType): Promise<ApiResponse> {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { id } = user;
      const cart_item = await CartItem.findOne({
        where: { cart_item_id: cartItemId },
        include: [
          {
            model: Cart,
            as: 'cart',
            where: { user_id: id },
          }
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cart_item) {
        throw new BadRequestException('Cart item not found');
      }

      // Delete the cart item
      await cart_item.destroy({ transaction });

      await transaction.commit();

      return {
        message: 'Cart item deleted successfully.',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

}