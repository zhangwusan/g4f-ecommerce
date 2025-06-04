import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin@gmail.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'admin@1234' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
    validate(confirm_password: string, args: ValidationArguments) {
        const object = args.object as RegisterDto;
        return confirm_password === object.password;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Passwords do not match';
    }
}

export class RegisterDto {
    @IsNotEmpty({ message: 'First name is required' })
    first_name: string;

    @IsNotEmpty({ message: 'Last name is required' })
    last_name: string;

    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    @IsNotEmpty({ message: 'Confirm Password is required' })
    @MinLength(6, { message: 'Confirm Password must be at least 6 characters' })
    @Validate(MatchPassword)
    confirm_password: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    phone_number: string;

    @IsNotEmpty({ message: 'Address is required' })
    address: string;
}


export class LoginWithGoogle {

    @IsString()
    sub: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;
}