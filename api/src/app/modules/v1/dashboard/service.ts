import { BadRequestException, Injectable } from "@nestjs/common";
import { TotalSaleService } from "./total-sale/service";
import { TotalSaleResponse } from "./total-sale/interface";
import { SalesResponse } from "./sales/interface";
import { SalesService } from "./sales/service";
import { TopSellingController } from "./top-seller/controller";
import { TopSellingProductsResponse } from "./top-seller/interface";
import { TopSellingService } from "./top-seller/service";
import { DisplayProductEachCategoriesResponse } from "./display-product-each-categories/interface";
import { DisplayProductEachCategoriesService } from "./display-product-each-categories/service";


@Injectable()
export class DashboardService {
    constructor(
        private readonly total_sale_service: TotalSaleService,
        private readonly sales_service: SalesService,
        private readonly top_selling: TopSellingService,
        private readonly display_category_service: DisplayProductEachCategoriesService
    ) {}

    async get() {
        try {
            const total_sale: TotalSaleResponse = await this.total_sale_service.get();
            const sales: SalesResponse = await this.sales_service.get();
            const top_selling: TopSellingProductsResponse = await this.top_selling.get();
            const display_category: DisplayProductEachCategoriesResponse = await this.display_category_service.get();
            return {
                message: 'dashboard',
                data: {
                    total_sale: total_sale,
                    sales: sales,
                    top_selling: top_selling,
                    display_product_each_category: display_category
                }
            }
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
        }
    }
}