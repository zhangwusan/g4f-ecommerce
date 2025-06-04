import { Module } from "@nestjs/common";
import { ProductController } from "./controller";
import { ProductService } from "./service";
import { ProductEventModule } from "./event/module";
import { ProductManagementModule } from "./management/module";
import { ColorModule } from "./color/module";
import { CareInstructionModule } from "./care-instruction/module";
import { IngredientModule } from "./ingredient/module";
import { LabelModule } from "./label/module";
import { SizeModule } from "./size/module";
import { TagModule } from "./tag/module";
import { UsageInstructionModule } from "./usage-instruction/module";

@Module({
    imports: [
        ProductEventModule,
        ProductManagementModule,
        ColorModule,
        CareInstructionModule,
        IngredientModule,
        LabelModule,
        SizeModule,
        TagModule,
        UsageInstructionModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: []
})
export class ProductModule {}