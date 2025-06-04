import Order from '@/app/models/order/order.model';
import sequelizeConfig from '@/config/sequelize.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { CreateOrderDto, CreateOrderPaymentDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import OrderStatus from '@/app/models/order/order-status.model';
import { ORDER_STATUS } from '@/app/common/utils/enum/order-status.enum';
import Payment from '@/app/models/payment/payment.model';
import CartItem from '@/app/models/cart/cart-item.model';
import Cart from '@/app/models/cart/cart.model';
import User from '@/app/models/user/user.model';
import ProductVariant from '@/app/models/product/product-variants.model';
import OrderItem from '@/app/models/order/order-item.model';

@Injectable()
export class OrderService {
  async create(body: CreateOrderDto, user: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();

    try {
      const data = {
        user_id: user.id,
        order_date: new Date(),
        total_amount: body.total_amount,
        shipping_address: body.shipping_address,
        order_status_id: body.order_status_id,
      };

      const order = await Order.create(data, { transaction });

      // You can do more logic here (e.g., insert order items)

      await transaction.commit();
      return order;
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
  async createOrderWithPayment(body: CreateOrderPaymentDto, user: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const order_status_pending = await OrderStatus.findOne({
        attributes: ['id'],
        where: {
          name: ORDER_STATUS.PENDING
        }
      })
      if (!order_status_pending) {
        throw new BadRequestException('Order pending status not found!');
      }

      const order = await Order.create({
        user_id: user.id,
        order_date: new Date(),
        total_amount: body.amount / 100,
        shipping_address: body.shippingAddress,
        order_status_id: order_status_pending.id
      }, { transaction })

      // find cart item base on user
      const cartItems = await CartItem.findAll({
        attributes: ['cart_item_id', 'quantity', 'variant_id'],
        include: [
          {
            model: Cart,
            attributes: [],
            include: [
              {
                model: User,
                attributes: [],
                where: { id: user.id },
              },
            ],
          },
          {
            model: ProductVariant,
            attributes: ['product_id', 'color_id', 'size_id', 'price', 'discount'],
          },
        ],
        transaction,
      });

      await Promise.all(
        cartItems.map(async (item) => {
          const originalPrice = item.variant.price;
          const discount = item.variant.discount || 0;
          const effectivePrice = originalPrice * (1 - discount / 100);

          const order_item = await OrderItem.create({
            order_id: order.order_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price_at_purchase: parseFloat(effectivePrice.toFixed(2)),
          }, { transaction });
          return order_item
        })
      );

      const payment = await Payment.create(
        {
          order_id: order.order_id,
          payment_method: body.paymentMethod,
          transaction_id: body.transactionId,
          amount: body.amount / 100,
          payment_status: body.paymentStatus,
          payment_date: new Date(),
        },
        { transaction },
      );

      await transaction.commit()

      return order;
    } catch (error) {
      console.log(error);
      await transaction.rollback()
      throw new BadRequestException(error.message);
    }
  }
}