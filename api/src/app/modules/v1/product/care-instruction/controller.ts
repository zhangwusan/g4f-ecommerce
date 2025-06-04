// care-instruction/controller.ts

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
import { CareInstructionService } from './service';
import { CreateCareInstructionDto } from './dto';
import { UserDecorator, UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Controller()
export class CareInstructionController {
  constructor(private readonly _service: CareInstructionService) {}

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
    @Body() body: CreateCareInstructionDto,
    @UserDecorator() creator: UserDecoratorType,
  ) {
    return this._service.create(body, creator);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateCareInstructionDto,
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