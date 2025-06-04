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
import { UsageInstructionService } from './service';
import { CreateUsageInstructionDto } from './dto';
import { UserDecorator, UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Controller()
export class UsageInstructionController {
  constructor(private readonly _service: UsageInstructionService) {}

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
  create(
    @Body() body: CreateUsageInstructionDto,
    @UserDecorator() creator: UserDecoratorType,
  ) {
    return this._service.create(body, creator);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUsageInstructionDto,
    @UserDecorator() updater: UserDecoratorType,
  ) {
    return this._service.update(id, body, updater);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() deleter: UserDecoratorType,
  ) {
    return this._service.delete(id, deleter);
  }
}