import { Type } from 'class-transformer';
import { IsInt, IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    shipping_address: string;

    @IsNumber()
    @Min(0)
    total_amount: number;

    @IsInt()
    order_status_id: number;
}

export class CreateOrderPaymentDto {
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;

    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    transactionId: string;

    @IsNumber({}, { message: 'Amount must be a number' })
    @Type(() => Number)
    amount: number;

    @IsString()
    @IsNotEmpty()
    paymentStatus: string;
}