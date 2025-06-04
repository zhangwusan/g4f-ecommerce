import { UserPayload } from '@/app/common/interfaces/jwt.interface';
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export interface UserDecoratorType {
    id: number;
    username: string;
    email: string;
    role_id: number;
    role_name: string;
    is_2fa: boolean;
}

export const UserDecorator = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UserDecoratorType => {
        const request = ctx.switchToHttp().getRequest();

        const user: UserPayload = request['user']

        if (!user) {
            throw new BadRequestException('Unauthenticated');
        }

        const user_decorator: UserDecoratorType = {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role,
            role_name: user.role_name,
            is_2fa: user.is_2fa
        }
        return user_decorator
    },
);