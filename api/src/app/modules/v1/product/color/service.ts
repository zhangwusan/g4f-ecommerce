import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { Op, OrderItem, Sequelize } from 'sequelize';
import sequelizeConfig from '@/config/sequelize.config';
import Color from '@/app/models/product/color.model';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Injectable()
export class ColorService {

    async get(query: BaseQueryDto) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const offset = (page - 1) * limit;
            const sortKey = query.sort || 'id';
            const sortOrder = query.order || 'desc';
            const search = query.search || '';

            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['id', sortOrder],
                name: ['name', sortOrder],
                created_at: ['created_at', sortOrder],
                updated_at: ['updated_at', sortOrder],
            };

            const order: OrderItem[] = [SORT_CONFIG[sortKey]];

            const whereClause = search
                ? {
                    name: {
                        [Op.iLike]: `%${search}%`, // Use Op.like for MySQL
                    },
                }
                : {};

            const { rows: data, count } = await Color.findAndCountAll({
                attributes: ['id', 'name', 'created_at', 'updated_at'],
                where: whereClause,
                order,
                limit,
                offset,
            });

            return {
                message: 'Color fetched successfully.',
                data: data.map(b => ({
                    id: b.id,
                    name: b.name,
                    created_at: b.created_at.toLocaleString(),
                    updated_at: b.created_at.toLocaleString(),
                })),
                pagination: {
                    current_page: +page,
                    per_page: +limit,
                    total_page: Math.ceil(count / limit),
                    total_items: count,
                },
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async view(id: number) {
        try {
            const color = await Color.findByPk(id, {
                attributes: ['id', 'name']
            })

            if (!color) {
                throw new BadRequestException('Color not found')
            }

            const sanitizedColor = {
                id: color.id ?? 'N/A',
                name: color.name ?? 'N/A',
            }

            return sanitizedColor
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async create(body: CreateColorDto, creator: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const existing = await Color.findOne({
                where: { name: body.name },
                paranoid: false,
                transaction,
            });

            if (existing) {
                if (existing.deleted_at) {
                    await existing.restore({ transaction });
                    existing.creator_id = creator.id;
                    await existing.save({ transaction });
                    await transaction.commit();
                    return existing;
                } else {
                    throw new BadRequestException(`Color with name "${body.name}" already exists.`);
                }
            }

            const color = await Color.create(
                {
                    name: body.name,
                    creator_id: creator.id,
                },
                { transaction },
            );

            await transaction.commit();
            return color;
        } catch (error) {
            await transaction.rollback();
            throw error instanceof BadRequestException
                ? error
                : new BadRequestException(error.message);
        }
    }

    async update(id: number, body: CreateColorDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();
        try {
            const color = await Color.findByPk(id);
            if (!color) throw new BadRequestException('Color not found');

            await color.update(
                {
                    name: body.name,
                    updater_id: updater.id,
                },
                { transaction },
            );
            await transaction.commit();
            return color;
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number, deleter: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();
        try {
            const color = await Color.findByPk(id);
            if (!color) throw new BadRequestException('Color not found');

            await color.update({ deleter_id: deleter.id });
            await color.destroy({ transaction });

            await transaction.commit();
            return { message: 'Color deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }
}