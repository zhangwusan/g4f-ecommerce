import { Module } from "@nestjs/common";
import { PaymentController } from "./controller";
import { PaymentService } from "./service";

@Module({
    imports: [],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: []
})
export class PaymentModule {}