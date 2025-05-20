import { Routes } from "@nestjs/core";
import { AuthModule } from "./auth/module";
import { ProductModule } from "./product/module";
import { BrandModule } from "./brand/module";
import { CategoryModule } from "./category/module";
import { cartRoutes } from "./cart/routes";
import { productRoutes } from "./product/routes";
import { authRoutes } from "./auth/routes";
import { FileModule } from "./file/module";
import { PaymentModule } from "./payment/module";
import { dashboardRoutes } from "./dashboard/routes";


export const v1Routes: Routes = [
    {
        path: '/',
        children: [
            {
                path: 'auth',
                children: authRoutes
            },
            {
                path: 'brands',
                module: BrandModule
            },
            {
                path: 'products',
                children: productRoutes
            },
            {
                path: 'categories',
                module: CategoryModule
            },
            {
                path: 'carts',
                children: cartRoutes
            },
            {
                path: 'file',
                module: FileModule
            },
            {
                path: 'payment',
                module: PaymentModule
            },
            {
                path: 'dashboard',
                children: dashboardRoutes
            }
        ]
    }
]