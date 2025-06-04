import { Module } from '@nestjs/common';
import { SizeController } from './controller';
import { SizeService } from './service';

@Module({
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}