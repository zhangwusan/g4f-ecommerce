import { Module } from "@nestjs/common";
import { OrderController } from "./controller";
import { OrderService } from "./service";

@Module({
    imports: [],
    controllers: [OrderController],
    providers: [OrderService],
    exports: []
})
export class OrderModule {}