import { MatchPasswords, MatchPasswordsConstraint } from '@/app/common/validator/match-password';
import { IsString, MinLength, Matches, IsNotEmpty, Validate, IsOptional } from 'class-validator';

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'New password must contain at least one uppercase letter and one number',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MatchPasswords('newPassword', {
    message: 'Confirm password must match new password',
  })
  confirmPassword: string;
}

export class ChangeInfomationRequest {
  @IsString()
  @IsNotEmpty()
  first_name: string;
  @IsString()
  @IsNotEmpty()
  last_name: string;
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
  @IsString()
  @IsOptional()
  bio?: string;
}