import { Module } from "@nestjs/common";
import { ProductController } from "./controller";
import { ProductService } from "./service";
import { ProductEventModule } from "./event/module";

@Module({
    imports: [
        ProductEventModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: []
})
export class ProductModule {}