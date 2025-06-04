import { IsDecimal, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CheckListTransactionKHQRDto {
    @IsIn(['md5', 'hash'], { message: 'Type must be either "md5" or "hash"' })
    type: 'md5' | 'hash';

    @IsString()
    @IsNotEmpty({ message: 'Value must not be empty' })
    values: string[];
}

export class CheckTransactionKHQRDto {
    @IsIn(['md5', 'hash'], { message: 'Type must be either "md5" or "hash"' })
    type: 'md5' | 'hash';

    @IsString()
    @IsNotEmpty({ message: 'Value must not be empty' })
    value: string;
}

export class Md5CheckTransactionKHQRDto {
    @IsString()
    md5: string;
}

export class HashCheckTransactionKHQRDto {
    @IsString()
    hash: string;
}

export class GenerateQrKHQRDto {
    @IsDecimal()
    amount: number;
}