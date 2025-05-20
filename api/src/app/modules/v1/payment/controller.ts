import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./service";

@Controller()
export class PaymentController {
    constructor(private readonly _service: PaymentService) { }
    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        const paymentIntent = await this._service.createPaymentIntent(body.amount);
        return { clientSecret: paymentIntent.client_secret };
    }
}