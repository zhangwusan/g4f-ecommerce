import { Routes } from "@nestjs/core";
import { TotalSaleModule } from "./total-sale/module";
import { DashboardModule } from "./module";
import { SalesModule } from "./sales/module";
import { TopSellingModule } from "./top-seller/module";
import { DisplayProductEachCategoriesModule } from "./display-product-each-categories/module";
import { TotalRevenueModule } from "./total-revenue/module";
import { TotalOrderModule } from "./total-order/module";
import { RecentSalesModule } from "./recent-sale/module";
import { TotalStockModule } from "./total-stock/module";


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
            },
            {
                path: 'total-revenue',
                module: TotalRevenueModule
            },
            {
                path: 'total-order',
                module: TotalOrderModule,
            },
            {
                path: 'recent-sale',
                module: RecentSalesModule
            },
            {
                path: 'total-stock',
                module: TotalStockModule
            }
        ]
    }
]