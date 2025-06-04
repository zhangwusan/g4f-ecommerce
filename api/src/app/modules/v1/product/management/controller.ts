import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ProductManagementService } from "./service";
import { RolesGuard } from "@/app/common/guards/roles.guard";
import { Roles } from "@/app/common/decorators/roles.decorator";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { CreateProductManagementDto } from "./dto";

@Controller()
@UseGuards(RolesGuard)
@Roles('admin')
export class ProductManagementController {
    constructor(private readonly _service: ProductManagementService) { }

    @Get('setup')
    async setup() {
        // prepare data for display
        const data = await this._service.setup();
        return {
            message: 'Fetching successfully',
            data: data
        }
    }

    @Get()
    async get(
        @Query() query: BaseQueryDto
    ) {
        const headers = [
            { id: 1, label: 'ID' },
            { id: 2, label: 'Image' },
            { id: 3, label: 'Name' },
            { id: 4, label: 'Category' },
            { id: 5, label: 'Stock' },
            { id: 6, label: 'Price' },
            { id: 7, label: 'Rating' },
            { id: 8, label: 'Rating Count' },
            { id: 9, label: 'Expiry Date' }
        ]
        const data = await this._service.get(query);

        return {
            message: 'Fetching is successfully',
            data: data.products,
            pagination: data.pagination,
            headers: headers
        }
    }

    @Post()
    async create(
        @Body() body: CreateProductManagementDto,
        @UserDecorator() creator: UserDecoratorType
    ) {
        return this._service.create(body, creator);
    }

    @Get(':id')
    async view(
        @Param('id') id: number
    ) {
        return this._service.view(id)
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: CreateProductManagementDto,
        @UserDecorator() updater: UserDecoratorType
    ) {
        return this._service.update(id, body, updater);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: number,
        @UserDecorator() deleter: UserDecoratorType
    ) {
        return this._service.delete(id, deleter)
    }
}