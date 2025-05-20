import { Module } from "@nestjs/common";
import { TopSellingController } from "./controller";
import { TopSellingService } from "./service";



@Module({
    imports: [],
    controllers: [TopSellingController],
    providers: [TopSellingService],
    exports: []
})
export class TopSellingModule {}