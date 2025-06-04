import { Module } from "@nestjs/common";
import { PaymentController } from "./controller";
import { PaymentService } from "./service";
import { PAYKHQRModule } from "./pay-khqr/module";

@Module({
    imports: [PAYKHQRModule],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: []
})
export class PaymentModule {}