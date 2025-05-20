import { Controller, Get, Param, Query } from "@nestjs/common";
import { CategoryService } from "./service";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";

@Controller()
export class CategoryController {
    constructor(private readonly _service: CategoryService) { }

    @Get()
    get_data(
        @Query() query: BaseQueryDto
    ) {
        return this._service.get_data(query);
    }

    @Get('setup')
    setup() {
        return this._service.setup();
    }

    @Get('/filter')
    get_product_by_category_name(
        @Query('category_name') category_name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sort') sort?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('search') search?: string,
    ){
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
        return this._service.get_product_by_category_name(category_name, params);
    }
}