import {
    IsString,
    IsNumber,
    IsDate,
    IsOptional,
    IsArray,
    ValidateNested,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBase64Image } from '@/app/common/validator/image-base64';

// --- Dimension DTO ---
class CreateProductDimensionDto {
    @IsString() dimension_label: string;
    @IsString() width: string;
    @IsString() height: string;
    @IsString() depth: string;
    @IsString() weight: string;
}

// --- Product Variant DTO ---
class CreateProductVariantDto {
    @IsOptional() @IsNumber() variant_id: number;
    @IsNumber() color_id: number;
    @IsNumber() size_id: number;
    @IsNumber() price: number;
    @IsNumber() discount: number;
    @IsNumber() stock: number;
    @IsOptional() @IsString() sku?: string;
    @IsNumber() status_id: number;
}

// --- Main Product DTO ---
export class CreateProductManagementDto {
    @IsString() product_name: string;
    @IsString() slug: string;

    @IsNumber() price: number;
    @IsNumber() discount: number;

    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsString() short_description?: string;

    @IsOptional() @IsDateString() manufacturing_date?: Date;
    @IsOptional() @IsDateString() expiry_date?: Date;
    @IsOptional() @IsString() return_policy?: string;

    @IsNumber() brand_id: number;
    @IsNumber() category_id: number;

    @ValidateNested()
    @Type(() => CreateProductDimensionDto)
    dimension: CreateProductDimensionDto;

    @IsArray()
    @IsBase64Image({ each: true, message: 'Each image must be a valid base64 string' })
    images: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    product_variants: CreateProductVariantDto[];

    @IsOptional() @IsArray() tagIds?: number[];
    @IsOptional() @IsArray() ingredientIds?: number[];
    @IsOptional() @IsArray() careInstructionIds?: number[];
    @IsOptional() @IsArray() usageInstructionIds?: number[];
    @IsOptional() @IsArray() labelIds?: number[];
}


