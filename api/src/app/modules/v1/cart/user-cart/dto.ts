import { IsInt, IsPositive, Min, Max, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartRequest {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    product_id: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity: number;

    @Type(() => Number)
    @IsNumber({ allowNaN: false, allowInfinity: false })
    @Min(0)
    @Max(100)
    discount: number;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    color: number;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    size: number;
}