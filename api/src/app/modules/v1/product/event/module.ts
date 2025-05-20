import { Module } from "@nestjs/common";
import { ProductEventController } from "./controller";
import { ProductEventService } from "./service";


@Module({
    imports: [],
    controllers: [ProductEventController],
    providers: [ProductEventService],
    exports: []
})
export class ProductEventModule {}