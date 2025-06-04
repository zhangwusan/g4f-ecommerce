import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";



export class IsBase64ImageConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // accept only string
        if (typeof value != 'string') return false;

        const regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+\s*$/;

        return regex.test(value);
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'Image must be a valid base64-encoded image string (png, jpeg, jpg, gif, webp)';
    }
}

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64ImageConstraint,
    });
  };
}