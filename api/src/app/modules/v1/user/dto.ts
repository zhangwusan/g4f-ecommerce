import { IsBase64Image } from '@/app/common/validator/image-base64';
import { MatchPasswords } from '@/app/common/validator/match-password';
import { Transform } from 'class-transformer';
import {
    IsString,
    IsEmail,
    IsBoolean,
    IsOptional,
    IsPhoneNumber,
    IsNotEmpty,
    MinLength,
    Matches,
    IsNumber,
    IsInt,
    IsPositive,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsNotEmpty({ message: 'role_id is required' })
    @IsInt({ message: 'role_id must be an integer' })
    @IsPositive({ message: 'role_id must be a positive number' })
    @Transform(({ value }) => parseInt(value, 10))
    role_id: number;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Confirm password is required' })
    @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
    @MatchPasswords('password', {
        message: 'Confirm password must match password',
    })
    confirm_password: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^\d{9,15}$/, { message: 'Phone number must be in format' })
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsOptional()
    @IsString()
    @IsBase64Image({ message: 'Please provide a valid base64 image string' })
    avatar?: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsNotEmpty()
    is_active: boolean;

    @IsOptional()
    @IsString()
    bio?: string;
}


export class UpdateUserDto {
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email must be valid' })
    email?: string;

    @IsOptional()
    @Matches(/^\d{9,15}$/, {
        message: 'Phone number must be in international format starting with +',
    })
    phone_number?: string;

    @IsNotEmpty()
    @IsNotEmpty({ message: 'role_id is required' })
    @IsInt({ message: 'role_id must be an integer' })
    @IsPositive({ message: 'role_id must be a positive number' })
    @Transform(({ value }) => parseInt(value, 10))
    @IsOptional()
    role_id?: number;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    @IsBoolean({ message: 'is_active must be a boolean value' })
    is_active?: boolean;

    @IsOptional()
    @IsString()
    bio?: string;
}

export class UpdatePasswordDto {
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Confirm password is required' })
    @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
    @MatchPasswords('password', {
        message: 'Confirm password must match password',
    })
    confirm_password: string;
}

export class UpdateAvatarDto {
    @IsString()
    @IsBase64Image({ message: 'Please provide a valid base64 image string' })
    avatar?: string;
}