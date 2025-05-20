import { Module } from "@nestjs/common";
import { DisplayProductEachCategoriesService } from "./service";
import { DisplayProductEachCategoriesController } from "./controller";



@Module({
    imports: [],
    controllers: [DisplayProductEachCategoriesController],
    providers: [DisplayProductEachCategoriesService],
    exports: []
})
export class DisplayProductEachCategoriesModule {}