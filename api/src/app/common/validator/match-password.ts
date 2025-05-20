import { ChangePasswordRequest } from '@/app/modules/v1/auth/profile/dto';
import {
    IsString,
    MinLength,
    Matches,
    IsNotEmpty,
    ValidateIf,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPasswords', async: false })
export class MatchPasswordsConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        const obj = args.object as ChangePasswordRequest;
        return confirmPassword === obj.newPassword;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Confirm password must match new password';
    }
}