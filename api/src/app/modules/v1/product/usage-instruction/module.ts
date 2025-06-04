import { Module } from '@nestjs/common';
import { UsageInstructionController } from './controller';
import { UsageInstructionService } from './service';

@Module({
  controllers: [UsageInstructionController],
  providers: [UsageInstructionService],
})
export class UsageInstructionModule {}