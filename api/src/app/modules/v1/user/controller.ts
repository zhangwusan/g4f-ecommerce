import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./service";
import { RolesGuard } from "@/app/common/guards/roles.guard";
import { Roles } from "@/app/common/decorators/roles.decorator";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import { ApiResponse } from "@/app/common/interfaces/api.interface";
import { UserDetailResponse, UserDisplayResponse } from "./interface";
import { CreateUserDto, UpdateAvatarDto, UpdatePasswordDto, UpdateUserDto } from "./dto";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";

@Controller()
@UseGuards(RolesGuard)
@Roles('admin')
export class UserController {
    constructor(private readonly _service: UserService) { }

    @Get('setup')
    async setup() {
        const data = await this._service.setup()
        return {
            message: 'Information for creating user',
            data: data
        }
    }


    @Get()
    async get(
        @Query() query: BaseQueryDto
    ) {
        const data = await this._service.get(query)
        const headers = [
            { id: 'user_id', label: 'ID' },
            { id: 'username', label: 'Name' },
            { id: 'email', label: 'Email' },
            { id: 'phone_number', label: 'Phone' },
            { id: 'role_name', label: 'Role' },
        ]
        return {
            message: 'Fetching successfully',
            data: data.users,
            headers: headers,
            pagination: data.pagination,
        }
    }

    @Post()
    async create(
        @Body() body: CreateUserDto,
        @UserDecorator() creator: UserDecoratorType,
    ): Promise<ApiResponse> {
        const data = await this._service.create(body, creator);
        if (!data) {
            return {
                message: 'Failed to create user',
            }
        }
        return {
            message: 'User is created',
            data: data
        }
    }

    @Get(':id')
    async view(
        @Param('id') id: number
    ): Promise<ApiResponse<UserDetailResponse>> {
        const data = await this._service.view(id);
        return {
            message: 'Fetch data is successfully.',
            data: data
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UpdateUserDto,
        @UserDecorator() updater: UserDecoratorType,
    ): Promise<ApiResponse> {
        const data = await this._service.update(id, body, updater)
        if (!data) {
            return { message: 'Failed to updated data' }
        }
        return {
            message: 'Updated is successfully',
            data: data
        }
    }

    @Put('update-password/:id')
    async update_password(
        @Param('id') id: number,
        @Body() body: UpdatePasswordDto,
        @UserDecorator() updater: UserDecoratorType,
    ) {
        return await this._service.update_password(id, body, updater);
    }

    @Put('update-avatar/:id')
    async update_avatar(
        @Param('id') id: number,
        @Body() body: UpdateAvatarDto,
        @UserDecorator() updater: UserDecoratorType,
    ) {
        return await this._service.update_avatar(id, body, updater);
    }
    @Delete(':id')
    async delete(
        @Param('id') id: number,
        @UserDecorator() deleter: UserDecoratorType,
    ) {
        return await this._service.delete(id, deleter)
    }

}