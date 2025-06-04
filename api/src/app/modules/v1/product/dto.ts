import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  IsEnum,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityStatus } from '@/app/common/utils/enum/availability-status.enum';

class VariantDto {
  @IsInt()
  color_id: number;

  @IsInt()
  size_id: number;

  @IsNumber()
  price: number;

  @IsNumber()
  discount: number;

  @IsInt()
  stock: number;

  @IsEnum(AvailabilityStatus)
  availability_status: AvailabilityStatus;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  short_description?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  skin_type?: string;

  @IsInt()
  stock_quantity: number;

  @IsInt()
  stock: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsInt()
  @IsOptional()
  rating_count?: number;

  @IsEnum(AvailabilityStatus)
  availability_status: AvailabilityStatus;

  @IsBoolean()
  is_featured: boolean;

  @IsBoolean()
  best_seller: boolean;

  @IsBoolean()
  new_arrival: boolean;

  @IsDate()
  @Type(() => Date)
  manufacturing_date: Date;

  @IsDate()
  @Type(() => Date)
  expiry_date: Date;

  @IsString()
  weight: string;

  @IsString()
  width: string;

  @IsString()
  height: string;

  @IsString()
  depth: string;

  @IsString()
  @IsOptional()
  return_policy?: string;

  @IsString()
  @IsOptional()
  meta_title?: string;

  @IsString()
  @IsOptional()
  meta_description?: string;

  @IsInt()
  brand_id: number;

  @IsInt()
  category_id: number;

  @IsArray()
  @IsInt({ each: true })
  tag_ids: number[];

  @IsArray()
  @IsString({ each: true })
  image_urls: string[];

  @IsArray()
  @IsInt({ each: true })
  ingredient_ids: number[];

  @IsArray()
  @IsInt({ each: true })
  care_instruction_ids: number[];

  @IsArray()
  @IsInt({ each: true })
  usage_instruction_ids: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}