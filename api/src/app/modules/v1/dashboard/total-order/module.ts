import { Module } from "@nestjs/common";
import { TotalOrderController } from "./controller";
import { TotalOrderService } from "./service";



@Module({
    imports: [],
    controllers: [TotalOrderController],
    providers: [TotalOrderService],
    exports: []
})
export class TotalOrderModule {}