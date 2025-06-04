import { databaseConstants } from "@/app/common/constants/database.constants";
import { BaseQueryDto } from "@/app/common/dto/base-query.dto";
import Role from "@/app/models/user/role.model";
import User from "@/app/models/user/user.model";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Op, OrderItem, Sequelize } from "sequelize";
import { mapToUserDetailResponse, mapToUserDisplayResponse } from "./map";
import { Pagination } from "@/app/common/interfaces/api.interface";
import { CreateUserDto, UpdateAvatarDto, UpdatePasswordDto, UpdateUserDto } from "./dto";
import sequelizeConfig from "@/config/sequelize.config";
import { UserDecoratorType } from "@/app/common/decorators/user.decorator";
import { EncodedService } from "@/app/common/services/encode.service";

@Injectable()
export class UserService {
    private readonly _encode_service: EncodedService
    constructor() {
        this._encode_service = new EncodedService('public/uploads/users')
    }


    async setup() {
        try {
            const roles = await Role.findAll({
                attributes: ['id', 'name']
            });

            return roles
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async get(query: BaseQueryDto) {
        try {
            // pagination
            const DEFAULT_PAGE = 1;
            const DEFAULT_LIMIT = 10;

            const page = query.page ? query.page : DEFAULT_PAGE;
            const limit = query.limit ? query.limit : DEFAULT_LIMIT;

            const offset = (page - 1) * limit;

            const sortKey = query.sort ?? 'id';
            const sortOrder: 'asc' | 'desc' = query.order ?? 'asc';

            // Define a clean type-safe sort config
            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['id', sortOrder],
                username: ['username', sortOrder],
                email: ['email', sortOrder],
                first_name: ['first_name', sortOrder],
                last_name: ['last_name', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
            };

            const order: OrderItem[] = SORT_CONFIG[sortKey]
                ? [SORT_CONFIG[sortKey]]
                : [['id', 'asc']];


            // search
            const likeOperator = databaseConstants.connection === 'postgres' ? Op.iLike : Op.like;

            const search = query.search;

            const whereClause = search ? {
                [Op.or]: [
                    {
                        username: { [likeOperator]: `%${search}%` },
                    }
                ],
            } : {};

            const { rows: users, count } = await User.findAndCountAll({
                attributes: ['id', 'username', 'email', 'phone_number', 'address', 'avatar', 'is_active', 'role_id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        as: 'creator'
                    },
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    }
                ],
                order,
                limit,
                offset,
                paranoid: true,
                where: {
                    ...whereClause
                }
            })

            const pagination: Pagination = {
                current_page: page,
                page_size: limit,
                total_items: count,
                total_pages: Math.ceil(count / limit)
            }

            return {
                users: users.map(user => mapToUserDisplayResponse(user)),
                pagination: pagination
            };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async create(data: CreateUserDto, creator: UserDecoratorType): Promise<User> {
        const sequelize = new Sequelize(sequelizeConfig)
        const transaction = await sequelize.transaction();
        try {
            // check if the is not match
            if (data.password !== data.confirm_password) {
                throw new BadRequestException('Password and confirm password do not match');
            }

            // Check uniqueness with transaction option
            const existPhone = await User.findOne({
                where: { phone_number: data.phone_number },
                transaction,
            });
            if (existPhone) throw new BadRequestException('Phone number already exists');

            const existUsername = await User.findOne({
                where: { username: data.username },
                transaction,
            });
            if (existUsername) throw new BadRequestException('Username already exists');

            const existEmail = await User.findOne({
                where: { email: data.email },
                transaction,
            });
            if (existEmail) throw new BadRequestException('Email already exists');

            let avatarPath = null;
            if (data.avatar) {
                if (!this._encode_service.isBase64Image(data.avatar)) {
                    throw new BadRequestException('Invalid base64 image string');
                }
                avatarPath = this._encode_service.saveBase64Image(data.avatar);
            }


            const user = await User.create(
                {
                    ...data,
                    avatar: avatarPath,
                    creator_id: creator.id,
                },
                { transaction }
            );
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number) {
        try {
            const user = await User.findByPk(id, {
                attributes: ['id', 'first_name', 'last_name', 'username', 'email', 'phone_number', 'address', 'avatar', 'is_active', 'bio'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    },
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        as: 'creator'
                    },
                ]
            })

            if (!user) {
                throw new BadRequestException('User not found!');
            }

            return mapToUserDetailResponse(user)


        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: number, data: UpdateUserDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            // Find user by id first
            const user = await User.findByPk(id, { transaction });
            if (!user) {
                throw new BadRequestException('User not found');
            }

            // If updating phone_number, check uniqueness
            if (data.phone_number && data.phone_number !== user.phone_number) {
                const existPhone = await User.findOne({
                    where: { phone_number: data.phone_number },
                    transaction,
                });
                if (existPhone) {
                    throw new BadRequestException('Phone number already exists');
                }
            }

            // If updating username, check uniqueness
            if (data.username && data.username !== user.username) {
                const existUsername = await User.findOne({
                    where: { username: data.username },
                    transaction,
                });
                if (existUsername) {
                    throw new BadRequestException('Username already exists');
                }
            }

            // If updating email, check uniqueness
            if (data.email && data.email !== user.email) {
                const existEmail = await User.findOne({
                    where: { email: data.email },
                    transaction,
                });
                if (existEmail) {
                    throw new BadRequestException('Email already exists');
                }
            }

            // Update user fields with the incoming data (only keys that exist in DTO)
            await user.update(
                {
                    ...data,
                    updater_id: updater.id, // if you track who updated
                },
                { transaction }
            );

            await transaction.commit();

            return user;
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async update_password(id: number, data: UpdatePasswordDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();
        try {

            if (data.password !== data.confirm_password) {
                throw new BadRequestException('Password and confirm password do not match');
            }

            const user = await User.findByPk(id, { transaction });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            if (updater.role_name !== 'admin') throw new ForbiddenException();

            user.password = data.password;

            await user.save({ transaction });

            await transaction.commit();

            return { message: 'Password updated successfully' };

        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message)
        }
    }

    async update_avatar(id: number, data: UpdateAvatarDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(id, { transaction });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Validate base64 avatar (this should already be done by DTO, but double-checking)
            if (!data.avatar || !this._encode_service.isBase64Image(data.avatar)) {
                throw new BadRequestException('Invalid base64 image string');
            }

            const path = this._encode_service.saveBase64Image(data.avatar);

            user.avatar = path;
            user.updater_id = updater.id;

            await user.save({ transaction });
            await transaction.commit();

            return {
                message: 'Avatar updated successfully',
                avatar: path,
            };
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number, deleter: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findByPk(id, { transaction });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            user.deleter_id = deleter.id;

            await user.destroy({ transaction });
            await transaction.commit();

            return {
                message: 'User deleted successfully',
            };
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }
}