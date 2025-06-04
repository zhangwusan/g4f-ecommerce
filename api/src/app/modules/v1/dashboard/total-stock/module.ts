import { Module } from "@nestjs/common";
import { TotalStockController } from "./controller";
import { TotalStockService } from "./service";


@Module({
    imports: [],
    controllers: [TotalStockController],
    providers: [TotalStockService],
    exports: []
})
export class TotalStockModule {}