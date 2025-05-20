import { Routes } from "@nestjs/core";
import { TotalSaleModule } from "./total-sale/module";
import { DashboardModule } from "./module";
import { SalesModule } from "./sales/module";
import { TopSellingModule } from "./top-seller/module";
import { DisplayProductEachCategoriesModule } from "./display-product-each-categories/module";


export const dashboardRoutes: Routes = [
    {
        path: '/',
        children: [
            {
                path: '/',
                module: DashboardModule,
            },
            {
                path: 'total-sale',
                module: TotalSaleModule 
            },
            {
                path: 'sales',
                module: SalesModule
            },
            {
                path: 'top-selling',
                module: TopSellingModule
            },
            {
                path: 'display-product-each-categories',
                module: DisplayProductEachCategoriesModule
            }
        ]
    }
]