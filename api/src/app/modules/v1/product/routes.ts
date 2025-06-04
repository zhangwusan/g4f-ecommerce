import { Routes } from "@nestjs/core";
import { ProductModule } from "./module";
import { ProductEventModule } from "./event/module";
import { ProductManagementModule } from "./management/module";
import { ColorModule } from "./color/module";
import { CareInstructionModule } from "./care-instruction/module";
import { IngredientModule } from "./ingredient/module";
import { LabelModule } from "./label/module";
import { SizeModule } from "./size/module";
import { TagModule } from "./tag/module";
import { UsageInstructionModule } from "./usage-instruction/module";

export const productRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: ProductModule
            },
            {
                path: 'event',
                module: ProductEventModule
            },
            {
                path: 'management',
                module: ProductManagementModule
            },
            {
                path: 'colors',
                module: ColorModule
            },
            {
                path: 'care-instructions',
                module: CareInstructionModule
            },
            {
                path: 'ingredients',
                module: IngredientModule
            },
            {
                path: 'labels',
                module: LabelModule
            },
            {
                path: 'sizes',
                module: SizeModule
            },
            {
                path: 'tags',
                module: TagModule
            },
            {
                path: 'usage-instructions',
                module: UsageInstructionModule
            }
        ]
    }
]