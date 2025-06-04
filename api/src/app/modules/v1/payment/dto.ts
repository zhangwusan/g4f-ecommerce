import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  payment_method: string;

  @IsString()
  transaction_id: string;
}