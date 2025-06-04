import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "./service";
import { CreateOrderDto, CreateOrderPaymentDto } from "./dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
export class OrderController {
    constructor(private readonly _service: OrderService) { }
    @Post()
    async create(
        @Body() body: CreateOrderDto,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.create(body, user)
    }

    @Post('checkout')
    async checkout(@Body() body: CreateOrderPaymentDto, @UserDecorator() user: UserDecoratorType) {
        const order = await this._service.createOrderWithPayment(body, user);
        return { orderId: order.order_id };
    }
}