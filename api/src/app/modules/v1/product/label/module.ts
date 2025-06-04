import { Module } from '@nestjs/common';
import { LabelController } from './controller';
import { LabelService } from './service';

@Module({
  controllers: [LabelController],
  providers: [LabelService],
})
export class LabelModule {}