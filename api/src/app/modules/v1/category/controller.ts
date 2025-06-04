import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { CategoryService } from "./service";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import { CreateCategoryDto } from "./dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
export class CategoryController {
    constructor(private readonly _service: CategoryService) { }

    @Get()
    get_data(
        @Query() query: BaseQueryDto
    ) {
        return this._service.get_data(query);
    }

    @Get('all-categories')
    get(
        @Query() query: BaseQueryDto
    ) {
        return this._service.get(query);
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
        return this._service.get_product_by_category_name(category_name, params);
    }

    @Post()
    create(
        @Body() body: CreateCategoryDto,
        @UserDecorator() creator: UserDecoratorType
    ) {
        return this._service.create(body, creator)
    }

    @Get(':id')
    async view(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this._service.view(id);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateCategoryDto,
        @UserDecorator() updater: UserDecoratorType,
    ) {
        return this._service.update(id, body, updater);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() deleter: UserDecoratorType,
    ) {
        return this._service.delete(id, deleter);
    }

}