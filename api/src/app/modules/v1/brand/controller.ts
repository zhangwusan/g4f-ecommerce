import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { BrandService } from "./service";
import { CreateBrandDto } from "./dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller()
export class BrandController {
    constructor(private readonly _service: BrandService) { }

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

    @Post()
    async create(
        @Body() body: CreateBrandDto,
        @UserDecorator() creator: UserDecoratorType,
    ) {
        return this._service.create(body, creator);
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
        @Body() body: CreateBrandDto,
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