import { BadRequestException, Body, Controller, Post, Req, UnauthorizedException } from "@nestjs/common";
import { E2FAService } from "./service";
import { UserDecorator, UserDecoratorType } from "@/app/common/decorators/user.decorator";
import User from "@/app/models/user/user.model";
import { UserPayload } from "@/app/common/interfaces/jwt.interface";
import { JwtService } from "@/app/common/services";
import { VerifyCodeRequest } from "./dto";
import Role from "@/app/models/user/role.model";
import { ApiBearerAuth } from "@nestjs/swagger";



@Controller()
export class E2FAController {
    constructor(
        private readonly _service: E2FAService,
        private readonly _jwt_service: JwtService
    ) { }

    @Post('generate')
    async generate(
        @UserDecorator() user: UserDecoratorType
    ) {
        const { otpauthUrl, base32 } = this._service.generateSecret(user.email);

        const exist_user = await User.findOne({
            where: {
                id: user.id
            }
        });

        if (!exist_user) {
            throw new BadRequestException('User not found')
        }

        await exist_user.update({
            twoFactorSecret: base32,
        })

        const qrCode = await this._service.generateQRCode(otpauthUrl);
        return { qrCode, base32 };
    }

    @Post('enable')
    async enable(
        @Body('code') code: string,
        @UserDecorator() userdec: UserDecoratorType
    ) {
        const user = await User.findOne({
            where: { id: userdec.id }
        });

        const isValid = this._service.verifyToken(user.twoFactorSecret, code);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');


        await user.update({
            isTwoFactorEnabled: true
        });
        return { success: true };
    }

    @Post('verify')
    async verify(
        @Body('code') code: string,
        @UserDecorator() userdec: UserDecoratorType
    ) {
        const user = await User.findOne({
            where: { id: userdec.id }
        });

        const isValid = this._service.verifyToken(user.twoFactorSecret, code);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

        return { success: true };
    }


    @Post('disable')
    async disable(
        @Body('code') code: string,
        @UserDecorator() userdec: UserDecoratorType
    ) {
        const user = await User.findOne({
            where: { id: userdec.id }
        });;

        // Optional: require 2FA code to disable (recommended for security)
        const isValid = this._service.verifyToken(user.twoFactorSecret, code);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

        await user.update({
            twoFactorSecret: null,
            isTwoFactorEnabled: false,
        });
        return { success: true };
    }

    @Post('verify-login')
    async verify_login(
        @Body() body: VerifyCodeRequest,
        @UserDecorator() userdec: UserDecoratorType
    ) {
        const user = await User.findOne({
            where: { id: userdec.id },
            include: [
                {
                    model: Role,
                    attributes: ['name']
                }
            ]
        });

        const isValid = this._service.verifyToken(user.twoFactorSecret, body.code);
        if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

        const payload: UserPayload = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            role: user.role_id,
            role_name: user.role.name,
            is_2fa: user.isTwoFactorEnabled,
            is_2fa_verified: isValid
        };

        return {
            message: '2FA verified',
            user: payload,
            token: {
                access: this._jwt_service.signAccessToken(payload),
                refresh: this._jwt_service.signRefreshToken(payload),
            },
            access_expires_in: this._jwt_service.getExpiresIn(),
        };
    }
}