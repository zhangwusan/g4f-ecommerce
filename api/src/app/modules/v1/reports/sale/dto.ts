import { TimeRangeType } from '@/app/common/utils/helper/date.helper';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class SalesReportQueryDto {
  @IsOptional()
  @IsString()
  type?: TimeRangeType = 'monthly';

  @IsOptional()
  @IsDateString()
  customStartDate?: string;

  @IsOptional()
  @IsDateString()
  customEndDate?: string;
}