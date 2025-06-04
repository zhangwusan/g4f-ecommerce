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
import { LabelService } from './service';
import { CreateLabelDto } from './dto';
import { UserDecorator, UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Controller()
export class LabelController {
  constructor(private readonly _service: LabelService) { }


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
    @Body() body: CreateLabelDto,
    @UserDecorator() creator: UserDecoratorType,
  ) {
    return this._service.create(body, creator);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateLabelDto,
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