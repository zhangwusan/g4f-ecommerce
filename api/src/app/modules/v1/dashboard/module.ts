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

@Module({
    imports: [
        TotalSaleModule,
        SalesModule,
        TopSellingModule,
        DisplayProductEachCategoriesModule
    ],
    providers: [
        DashboardService, 
        TotalSaleService, 
        SalesService,
        TopSellingService,
        DisplayProductEachCategoriesService
    ],
    controllers: [DashboardController]
})
export class DashboardModule{}