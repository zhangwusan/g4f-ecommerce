import { BaseQueryDto } from '@/app/common/dto/base-query.dto';
import Cart from '@/app/models/cart/cart.model';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  model = Cart;

  async get_data(query: BaseQueryDto) {
    try {
      // pagination
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const offset = (page - 1) * limit;

      // search
      

      const { rows, count } = await Cart.findAndCountAll({
        limit,
        offset,
      });

      return {
        message: 'Carts fetched successfully.',
        data: rows,
        pagination: {
            current_page: page,
            per_page: limit,
            total_page: Math.ceil(count / limit),
            total_items: count,
        },
    };

    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message);
    }
  }
}