// care-instruction/module.ts

import { Module } from '@nestjs/common';
import { CareInstructionController } from './controller';
import { CareInstructionService } from './service';

@Module({
  controllers: [CareInstructionController],
  providers: [CareInstructionService],
})
export class CareInstructionModule {}