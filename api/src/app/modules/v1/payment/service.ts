import { KHQRService } from '@/app/common/services/khqr.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';
import Payment from '@/app/models/payment/payment.model';
import Order from '@/app/models/order/order.model';
import User from '@/app/models/user/user.model';
import OrderItem from '@/app/models/order/order-item.model';
import OrderStatus from '@/app/models/order/order-status.model';
import { toPaymentDisplayHistory } from './map';
import { Pagination } from '@/app/common/interfaces/api.interface';
import ProductVariant from '@/app/models/product/product-variants.model';
import Product from '@/app/models/product/product.model';
import ProductImage from '@/app/models/product/product-images.model';
import { toPaymentReport } from '../reports/payment/map';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private _khqr_service: KHQRService
  private _

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this._khqr_service = new KHQRService();
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      return this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }
  }

  async get(query: BaseQueryDto, user_id: number) {
    try {

      const DEFAULT_PAGE = 1;
      const DEFAULT_LIMIT = 10;

      const page = query.page ? query.page : DEFAULT_PAGE;
      const limit = query.limit ? query.limit : DEFAULT_LIMIT;

      const offset = (page - 1) * limit;


      const { rows: payments, count } = await Payment.findAndCountAll({
        attributes: ['payment_id', 'payment_method', 'transaction_id', 'amount', 'payment_status', 'payment_date'],
        include: [
          {
            model: Order,
            attributes: ['shipping_address'],
            include: [
              {
                model: User,
                attributes: ['id']
              },
              {
                model: OrderStatus,
                attributes: ['name']
              }
            ]
          }
        ],
        where: {
          '$order.user.id$': user_id
        },
        order: [['created_at', 'DESC']],
        limit,
        offset,
        distinct: true
      });

       const pagination: Pagination = {
        current_page: page,
        page_size: limit,
        total_items: count,
        total_pages: Math.ceil(count / limit)
      }

      if (!payments?.length) {
        return {
          data: [],
          pagination: pagination
        }
      }

      return {
        data: payments.map(toPaymentDisplayHistory),
        pagination: pagination
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message);
    }
  }

  async view(payment_id: number, user_id: number) {
    try {
      const payment = await Payment.findOne({
        where: { payment_id: payment_id },
        attributes: ['payment_id', 'payment_method', 'transaction_id', 'amount', 'payment_status', 'payment_date'],
        include: [
          {
            model: Order,
            attributes: ['total_amount', 'shipping_address', 'order_date',],
            include: [
              {
                model: User,
                where: { id: user_id },
                attributes: ['username']
              },
              {
                model: OrderItem,
                attributes: ['quantity', 'price_at_purchase'],
                as: 'order_items',
                include: [
                  {
                    model: ProductVariant,
                    attributes: ['price', 'discount'],
                    include: [
                      {
                        model: Product,
                        attributes: ['return_policy'],
                        include: [
                          {
                            model: ProductImage,
                            attributes: ['image_url'],
                            where: { is_main: true },
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                model: OrderStatus,
                attributes: ['name']
              }
            ]
          }
        ]
      })

      if (!payment) {
        throw new BadRequestException('Payment not found or access denied.');
      }

      if (!payment.order) {
        throw new BadRequestException('Payment not found or access denied.');
      }

      const data = toPaymentReport(payment)
      return data;
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }
  }
}