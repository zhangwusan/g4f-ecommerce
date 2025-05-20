import { Controller, Get, Query } from "@nestjs/common";
import { CartService } from "./service";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";

@Controller()
export class CartController {
    constructor(private readonly _service: CartService) {}

    // Get all data
    @Get()
    get_data(
        @Query() query: BaseQueryDto
    ) {
        return this._service.get_data(query);
    }
    // View each data
    // Create data
    // Update data
    // Delete data
}