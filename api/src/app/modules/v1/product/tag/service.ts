import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import sequelizeConfig from '@/config/sequelize.config';
import Tag from '@/app/models/product/tag.model';
import { CreateTagDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Injectable()
export class TagService {

  async get(query: BaseQueryDto) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const offset = (page - 1) * limit;
      const sortKey = query.sort || 'id';
      const sortOrder = query.order || 'asc';
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

      const { rows: data, count } = await Tag.findAndCountAll({
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
      const data = await Tag.findByPk(id, {
        attributes: ['id', 'name']
      })

      if (!data) {
        throw new BadRequestException('Tag not found')
      }

      const sanitized = {
        id: data.id ?? 'N/A',
        name: data.name ?? 'N/A',
      }

      return sanitized
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async create(body: CreateTagDto, creator: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();

    try {
      const existing = await Tag.findOne({
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
          throw new BadRequestException(`With name "${body.name}" already exists.`);
        }
      }

      const color = await Tag.create(
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


  async update(id: number, body: CreateTagDto, updater: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const tag = await Tag.findByPk(id);
      if (!tag) throw new BadRequestException('Tag not found');

      await tag.update(
        {
          name: body.name,
          updater_id: updater.id,
        },
        { transaction },
      );
      await transaction.commit();
      return tag;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number, deleter: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const tag = await Tag.findByPk(id);
      if (!tag) throw new BadRequestException('Tag not found');

      await tag.update({ deleter_id: deleter.id });
      await tag.destroy({ transaction });

      await transaction.commit();
      return { message: 'Tag deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}