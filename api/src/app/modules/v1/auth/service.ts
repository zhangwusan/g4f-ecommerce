import { TokenPair } from "@/app/common/decorators/token.decorator";
import { JwtService } from "@/app/common/services/jwt.service";
import { TokenBlacklistService } from "@/app/common/services/token-blacklist.service";
import { RoleEnum } from "@/app/common/utils/enum/role.enum";
import { UserPayload } from "@/app/common/interfaces/jwt.interface";
import User from "@/app/models/user/user.model";
import sequelizeConfig from "@/config/sequelize.config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BLOB, Op, Sequelize } from "sequelize";
import Role from "@/app/models/user/role.model";
import { LoginWithGoogle } from "./dto";
import SocialUser from "@/app/models/user/social-users.model";

@Injectable()
export class AuthService {
    constructor(
        private readonly _token_blacklist: TokenBlacklistService,
        private readonly _jwt_service: JwtService
    ) { }

    /**
     * @description Login user
     * @param body {email: string, password: string}
     * @returns {Promise<{token: string}>}
     */
    async login(body: {
        email: string;
        password: string;
    }) {
        // find user by email from database
        try {
            const user = await User.findOne({
                where: {
                    email: body.email,
                },
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    }
                ]
            });
            if (!user) {
                throw new BadRequestException("Maybe user not found or password is incorrect");
            }
            // check if password is correct
            const isPasswordCorrect = await user.comparePassword(body.password);
            if (!isPasswordCorrect) {
                throw new BadRequestException("Maybe user not found or password is incorrect");
            }

            // prepare payload
            const payload: UserPayload = {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                email: user.email,
                role: user.role_id,
                role_name: user.role.name,
                is_2fa: user.isTwoFactorEnabled,
            }

            if (user.isTwoFactorEnabled) {
                const payload = { id: user.id, is_2fa: true }; // Temp token
                return {
                    requires2FA: true,
                    tempToken: this._jwt_service.signTempAccessToken(payload, { expiresIn: '1d' }),
                };
            }

            // sign access token and refresh token
            const access_token = this._jwt_service.signAccessToken(payload);
            const refresh_token = this._jwt_service.signRefreshToken(payload);

            return {
                message: "Login successfully",
                user: payload,
                token: {
                    access: access_token,
                    refresh: refresh_token
                },
                access_expires_in: this._jwt_service.getExpiresIn()
            }

        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }

        // if user not found, throw error
    }

    async google(body: LoginWithGoogle) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            let social_user = await SocialUser.findOne({ where: { provider: 'google', provider_id: body.sub } });

            if (!social_user) {
                social_user = await SocialUser.create({
                    provider: 'google',
                    provider_id: body.sub,
                });
            }

            let user = await User.findOne({
                where: {
                    [Op.or]: {
                        social_user_id: social_user.id,
                        email: body.email
                    }
                },
                transaction,
            });

            if (!user) {
                user = await User.create(
                    {
                        first_name: body.first_name,
                        last_name: body.last_name,
                        username: body.username,
                        email: body.email,
                        avatar: body.avatar,
                        role_id: RoleEnum.USER,
                        social_user_id: social_user.id,
                        password: null,
                    },
                    { transaction }
                );
            }

            const role = await Role.findOne({
                attributes: ['id', 'name'],
                where: {
                    id: user.role_id
                },
                transaction,
            })
            // prepare payload
            const payload: UserPayload = {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                email: user.email,
                role: user.role_id,
                role_name: role.name,
                is_2fa: user.isTwoFactorEnabled
            };

            if (user.isTwoFactorEnabled) {
                const payload = { id: user.id, is_2fa: true }; // Temp token
                const tempToken = this._jwt_service.signTempAccessToken(payload, { expiresIn: '5m' });
                return {
                    requires2FA: true,
                    tempToken
                };
            }

            const access = this._jwt_service.signAccessToken(payload);
            const refresh = this._jwt_service.signRefreshToken(payload);

            await transaction.commit();

            return {
                message: "Login successfully",
                user: payload,
                token: {
                    access: access,
                    refresh: refresh
                },
                access_expires_in: this._jwt_service.getExpiresIn()
            };
        } catch (error) {
            console.log(error)
            await transaction.rollback();
            throw new BadRequestException(error.message || 'Fail');
        }
    }

    /**
     * @description Register user
     * @param body {email: string, password: string}
     * @returns {Promise<{token: string}>}
     */
    async register(body: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
        confirm_password: string;
        phone_number: string;
        address: string;
    }) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const existing_user = await User.findOne({
                where: { email: body.email },
                transaction,
            });

            if (existing_user) {
                throw new BadRequestException('Email already exists');
            }

            const new_user = await User.create(
                {
                    email: body.email,
                    password: body.password,
                    first_name: body.first_name,
                    last_name: body.last_name,
                    username: body.username,
                    phone_number: body.phone_number,
                    address: body.address,
                    role_id: RoleEnum.USER,
                },
                { transaction }
            );

            await transaction.commit();

            const u = await User.findByPk(new_user.id, {
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    }
                ]
            })

            // prepare payload
            const payload: UserPayload = {
                id: u.id,
                username: u.username,
                avatar: u.avatar,
                email: u.email,
                role: u.role_id,
                role_name: u.role.name,
                is_2fa: u.isTwoFactorEnabled
            }

            // sign token
            const access_token = this._jwt_service.signAccessToken(payload);
            const refresh_token = this._jwt_service.signRefreshToken(payload);

            return {
                message: "Register successfully",
                user: payload,
                token: {
                    access: access_token,
                    refresh: refresh_token
                },
                access_expires_in: this._jwt_service.getExpiresIn()
            }

        } catch (error: any) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message || 'Registration failed');
        }
    }

    /**
     * @description Logout user
     * @param tokens {access_token, refresh_token}
     * @returns {Promise<{message: string}>}
     */
    async logout(tokens: TokenPair) {
        try {
            const { access_token, refresh_token } = tokens;
            const access_decoded = this._jwt_service.verifyAccessToken(access_token);
            const refresh_decoded = this._jwt_service.verifyRefreshToken(refresh_token);

            const current_time = Math.floor(Date.now() / 1000);

            const access_ttl = access_decoded.exp - current_time;
            const refresh_ttl = refresh_decoded.exp - current_time;

            if (access_ttl > 0) {
                await this._token_blacklist.blacklist(access_token, access_ttl);
            }

            if (refresh_ttl > 0) {
                await this._token_blacklist.blacklist(refresh_token, refresh_ttl);
            }

            return {
                message: 'Logout successfully',
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    /**
   * @description Refresh token
   * @param tokens {access_token, refresh_token}
   * @returns {Promise<{message: string, user: any, token: object, access_expires_in: Date}>}
   */
    async refresh_token(tokens: TokenPair) {
        try {
            const { access_token, refresh_token } = tokens;

            // 1. Verify the refresh token
            const refresh_payload = this._jwt_service.verifyRefreshToken(refresh_token);
            const user = refresh_payload.user;

            // 2. Generate new access & refresh tokens
            const new_access_token = this._jwt_service.signAccessToken(user);
            const new_refresh_token = this._jwt_service.signRefreshToken(user);

            // 3. Calculate expiry of new access token
            const access_expires_in = this._jwt_service.getExpiresIn();

            // 4. Blacklist old refresh token (rotation security)
            const ttl = refresh_payload.exp - Math.floor(Date.now() / 1000); // time left in seconds
            await this._token_blacklist.blacklist(refresh_token, ttl);

            // 5. Return response
            return {
                message: 'Token refreshed successfully',
                user,
                token: {
                    access: new_access_token,
                    refresh: new_refresh_token,
                },
                access_expires_in,
            };
        } catch (error) {
            console.error('[Refresh Token Error]', error);
            throw new BadRequestException('Invalid or expired refresh token.');
        }
    }
}