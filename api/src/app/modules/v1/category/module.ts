import { Module } from "@nestjs/common";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";


@Module({
    imports: [],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: []
})
export class CategoryModule {}