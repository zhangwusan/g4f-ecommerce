import { BadRequestException, Injectable } from "@nestjs/common";
import { TotalSaleService } from "./total-sale/service";
import { TotalSaleResponse } from "./total-sale/interface";
import { SalesResponse } from "./sales/interface";
import { SalesService } from "./sales/service";
import { TopSellingProductsResponse } from "./top-seller/interface";
import { TopSellingService } from "./top-seller/service";
import { DisplayProductEachCategoriesResponse } from "./display-product-each-categories/interface";
import { DisplayProductEachCategoriesService } from "./display-product-each-categories/service";
import { TotalRevenueResponse } from "./total-revenue/interface";
import { TotalRevenueService } from "./total-revenue/service";
import { TotalOrderService } from "./total-order/service";
import { TotalOrderResponse } from "./total-order/interface";
import { RecentSalesService } from "./recent-sale/service";
import { RecentSalesResponse } from "./recent-sale/interface";
import { TotalStockService } from "./total-stock/service";
import { TotalStockResponse } from "./total-stock/interface";


@Injectable()
export class DashboardService {
    constructor(
        private readonly total_sale_service: TotalSaleService,
        private readonly sales_service: SalesService,
        private readonly top_selling: TopSellingService,
        private readonly display_category_service: DisplayProductEachCategoriesService,
        private readonly total_revenue_service: TotalRevenueService,
        private readonly total_order_service: TotalOrderService,
        private readonly recent_sale_service: RecentSalesService,
        private readonly total_stock_service: TotalStockService
    ) {}

    async get() {
        try {
            const total_sale: TotalSaleResponse = await this.total_sale_service.get();
            const sales: SalesResponse = await this.sales_service.get();
            const top_selling: TopSellingProductsResponse = await this.top_selling.get();
            const display_category: DisplayProductEachCategoriesResponse = await this.display_category_service.get();
            const total_revenue: TotalRevenueResponse = await this.total_revenue_service.get();
            const total_order: TotalOrderResponse = await this.total_order_service.get();
            const recent_sale: RecentSalesResponse = await this.recent_sale_service.get();
            const total_stock: TotalStockResponse = await this.total_stock_service.get();


            return {
                message: 'dashboard',
                data: {
                    total_sale: total_sale,
                    sales: sales,
                    top_selling: top_selling,
                    display_product_each_category: display_category,
                    total_revenue: total_revenue,
                    total_order: total_order,
                    recent_sale: recent_sale,
                    total_stock: total_stock
                }
            }
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
        }
    }
}