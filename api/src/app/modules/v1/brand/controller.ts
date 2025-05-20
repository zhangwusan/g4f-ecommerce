import { Controller, Get, Query } from "@nestjs/common";
import { BrandService } from "./service";

@Controller()
export class BrandController {
    constructor(private readonly _service: BrandService) {}

    // Get all data
    @Get()
    get_data(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sort') sort?: string,
        @Query('order') order?: string,
        @Query('search') search?: string,

    ) {
        if (!page || !limit) {
            page = 1,
            limit = 10
        }
        const params = {
            page,
            limit,
            sort,
            order,
            search
        }
        return this._service.get_data(params);
    }
    // View each data
    // Create data
    // Update data
    // Delete data
}