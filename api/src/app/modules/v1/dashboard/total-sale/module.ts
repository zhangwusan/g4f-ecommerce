import { Module } from "@nestjs/common";
import { TotalSaleController } from "./controller";
import { TotalSaleService } from "./service";


@Module({
    imports: [],
    controllers: [TotalSaleController],
    providers: [TotalSaleService],
    exports: []
})
export class TotalSaleModule {}