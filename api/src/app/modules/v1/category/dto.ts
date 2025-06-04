import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  category_name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}