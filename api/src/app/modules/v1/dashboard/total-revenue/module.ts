import { Module } from "@nestjs/common";
import { TotalRevenueService } from "./service";
import { TotalRevenueController } from "./controller";


@Module({
    imports: [],
    controllers: [TotalRevenueController],
    providers: [TotalRevenueService],
    exports: []
})
export class TotalRevenueModule {}