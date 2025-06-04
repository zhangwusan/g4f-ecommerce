import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SizeService } from './service';
import { CreateSizeDto } from './dto';
import { UserDecorator, UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Controller()
export class SizeController {
  constructor(private readonly _service: SizeService) { }

  @Get()
  async get(
    @Query() query: BaseQueryDto
  ) {
    return this._service.get(query);
  }

  @Get(':id')
  async view(
    @Param('id') id: number
  ) {
    return this._service.view(id);
  }

  @Post()
  async create(
    @Body() body: CreateSizeDto,
    @UserDecorator() creator: UserDecoratorType,
  ) {
    return this._service.create(body, creator);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateSizeDto,
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