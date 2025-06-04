import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class GenerateReportDto {
  @IsString()
  title: string;

  @IsIn(['pdf', 'excel'])
  format: 'pdf' | 'excel';

  @IsArray()
  @IsObject({ each: true })
  data: Record<string, any>[];

  @IsOptional()
  @IsString()
  templatePath?: string; // optional custom path
}