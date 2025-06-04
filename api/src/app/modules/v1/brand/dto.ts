import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  brand_name: string;

  @IsString()
  @IsOptional()
  description?: string;
}