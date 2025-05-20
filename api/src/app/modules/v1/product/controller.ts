import { Controller, Get, Param, Put, Query } from "@nestjs/common";
import { ProductService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
export class ProductController {
    constructor(private readonly _service: ProductService) { }

    @Get()
    get_data(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sort') sort?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('search') search?: string,
    ) {
        if (!page || !limit) {
            page = 1,
                limit = 10
        }
        const params = {
            page,
            limit,
            sort,
            order,
            search
        }
        return this._service.get_data(params);
    }

    @Get('/detail/:product_id')
    view(
        @Param('product_id') product_id: number,
    ) {
        return this._service.view(product_id);
    }

    @Put('update_product_and_clean_cart')
    update_product_and_clean_cart(
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.update_product_and_clean_cart(user);
    }
}