import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UserCartService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { AddToCartRequest } from "./dto";

@Controller()
export class UserCartController {
    constructor(private readonly _service: UserCartService) {}

    // Add to Cart
    @Post()
    add(
        @Body() body: AddToCartRequest,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.add(body, user);
    }

    // Get cart belonging to the user
    @Get()
    get(
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.get(user);
    }

    @Patch(':cart_item_id')
    patch(
        @Param('cart_item_id') cart_item_id: number,
        @Query('quantity') quantity: number,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.patch(cart_item_id, quantity, user);
    }
    // Delete data

    @Delete(':cart_item_id')
    delete(
        @Param('cart_item_id') cart_item_id: number,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.delete(cart_item_id, user);
    }
}