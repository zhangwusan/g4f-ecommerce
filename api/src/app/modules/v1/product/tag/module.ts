import { Module } from '@nestjs/common';
import { TagController } from './controller';
import { TagService } from './service';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}