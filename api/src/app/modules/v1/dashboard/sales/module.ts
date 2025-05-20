import { Module } from "@nestjs/common";
import { SalesController } from "./controller";
import { SalesService } from "./service";



@Module({
    imports: [],
    controllers: [SalesController],
    providers: [SalesService],
    exports: []
})
export class SalesModule {}