import { Module } from "@nestjs/common";
import { TotalSaleModule } from "./total-sale/module";
import { DashboardService } from "./service";
import { DashboardController } from "./controller";
import { TotalSaleService } from "./total-sale/service";
import { SalesModule } from "./sales/module";
import { SalesService } from "./sales/service";
import { TopSellingModule } from "./top-seller/module";
import { TopSellingService } from "./top-seller/service";
import { DisplayProductEachCategoriesModule } from "./display-product-each-categories/module";
import { DisplayProductEachCategoriesService } from "./display-product-each-categories/service";
import { TotalRevenueModule } from "./total-revenue/module";
import { TotalRevenueService } from "./total-revenue/service";
import { TotalOrderModule } from "./total-order/module";
import { TotalOrderService } from "./total-order/service";
import { RecentSalesModule } from "./recent-sale/module";
import { RecentSalesService } from "./recent-sale/service";
import { TotalStockModule } from "./total-stock/module";
import { TotalStockService } from "./total-stock/service";

@Module({
    imports: [
        TotalSaleModule,
        SalesModule,
        TopSellingModule,
        DisplayProductEachCategoriesModule,
        TotalRevenueModule,
        TotalOrderModule,
        RecentSalesModule,
        TotalStockModule
    ],
    providers: [
        DashboardService, 
        TotalSaleService, 
        SalesService,
        TopSellingService,
        DisplayProductEachCategoriesService,
        TotalRevenueService,
        TotalOrderService,
        RecentSalesService,
        TotalStockService
    ],
    controllers: [DashboardController]
})
export class DashboardModule{}