import Brand from "@/app/models/brand/brand.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Op, OrderItem, Sequelize } from "sequelize";
import { CreateBrandDto } from "./dto";
import { UserDecoratorType } from "@/app/common/decorators/user.decorator";
import sequelizeConfig from "@/config/sequelize.config";

@Injectable()
export class BrandService {
    async get_data(params: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: string;
        search?: string;
    }) {
        try {
            const page = params.page || 1;
            const limit = params.limit || 10;
            const offset = (page - 1) * limit;
            const sortKey = params.sort || 'id';
            const sortOrder = params.order || 'asc';
            const search = params.search || '';

            const SORT_CONFIG: Record<string, OrderItem> = {
                id: ['brand_id', sortOrder],
                name: ['brand_name', sortOrder],
                created_at: ['created_at', sortOrder],
                updated_at: ['updated_at', sortOrder],
            };

            const order: OrderItem[] = [SORT_CONFIG[sortKey]]

            const whereClause = search
                ? {
                    brand_name: {
                        [Op.iLike]: `%${search}%`, // Use Op.like for MySQL
                    },
                }
                : {};

            const { rows: data, count } = await Brand.findAndCountAll({
                attributes: ['brand_id', 'brand_name', 'description', 'created_at', 'updated_at'],
                where: whereClause,
                order,
                limit,
                offset,
            });

            return {
                message: 'Brands fetched successfully.',
                data: data.map(b => ({
                    id: b.brand_id,
                    name: b.brand_name,
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
        const brand = await Brand.findByPk(id, {
            attributes: ['brand_id', 'brand_name', 'description', 'created_at', 'updated_at'],
        });
        if (!brand) {
            throw new BadRequestException('Brand not found');
        }
        const sanitizedBrand = brand
            ? {
                brand_id: brand.brand_id ?? 'N/A',
                brand_name: brand.brand_name ?? 'N/A',
                description: brand.description ?? 'N/A',
                created_at: brand.created_at ?? 'N/A',
                updated_at: brand.updated_at ?? 'N/A',
            }
            : null;
        return sanitizedBrand;
    }

    async create(body: CreateBrandDto, creator: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            // Find existing instruction, including soft-deleted
            const existing = await Brand.findOne({
                where: { brand_name: body.brand_name },
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
                    throw new BadRequestException('Instruction already exists');
                }
            }

            const instruction = await Brand.create(
                {
                    brand_name: body.brand_name,
                    creator_id: creator.id,
                },
                { transaction },
            );

            await transaction.commit();
            return instruction;
        } catch (error) {
            await transaction.rollback();
            throw error instanceof BadRequestException
                ? error
                : new BadRequestException(error.message);
        }
    }

    async update(id: number, body: CreateBrandDto, updater: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const brand = await Brand.findByPk(id);
            if (!brand) {
                throw new BadRequestException('Brand not found');
            }

            await brand.update(
                {
                    brand_name: body.brand_name,
                    description: body.description,
                    updater_id: updater.id,
                },
                { transaction },
            );

            await transaction.commit();
            return brand;
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }

    async delete(id: number, deleter: UserDecoratorType) {
        const sequelize = new Sequelize(sequelizeConfig);
        const transaction = await sequelize.transaction();

        try {
            const brand = await Brand.findByPk(id);
            if (!brand) {
                throw new BadRequestException('Brand not found');
            }

            await brand.update({
                deleter_id: deleter.id,
            });

            await brand.destroy({ transaction });

            await transaction.commit();
            return { message: 'Brand deleted successfully' };
        } catch (error) {
            await transaction.rollback();
            throw new BadRequestException(error.message);
        }
    }
}