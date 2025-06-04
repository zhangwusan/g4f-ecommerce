import { Module } from "@nestjs/common";
import { RecentSalesController } from "./controller";
import { RecentSalesService } from "./service";



@Module({
    imports: [],
    controllers: [RecentSalesController],
    providers: [RecentSalesService],
    exports: []
})
export class RecentSalesModule {}