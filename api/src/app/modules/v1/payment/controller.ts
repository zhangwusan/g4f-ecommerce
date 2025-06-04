import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { PaymentService } from "./service";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
export class PaymentController {
    constructor(private readonly _service: PaymentService) { }
    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        const paymentIntent = await this._service.createPaymentIntent(body.amount);
        return {
            clientSecret: paymentIntent.client_secret,
        };
    }

    @Get('get-transaction')
    async get(
        @Query() query: BaseQueryDto,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.get(query, user.id);
    }

    @Get('get-detail-transaction/:payment_id')
    async view(
        @Param('payment_id') payment_id: number,
        @UserDecorator() user: UserDecoratorType
    ) {
        return this._service.view(payment_id, user.id);
    }
}