import { Routes } from "@nestjs/core";
import { ProductModule } from "./module";
import { ProductEventModule } from "./event/module";

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
            }
        ]
    }
]