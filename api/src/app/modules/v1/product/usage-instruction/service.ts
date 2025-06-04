import { Injectable, BadRequestException } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import sequelizeConfig from '@/config/sequelize.config';
import UsageInstruction from '@/app/models/product/usage-instruction.model';
import { CreateUsageInstructionDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Injectable()
export class UsageInstructionService {

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
        name: ['instruction', sortOrder],
        created_at: ['created_at', sortOrder],
        updated_at: ['updated_at', sortOrder],
      };

      const order: OrderItem[] = [SORT_CONFIG[sortKey]];

      const whereClause = search
        ? {
          instruction: {
            [Op.iLike]: `%${search}%`, // Use Op.like for MySQL
          },
        }
        : {};

      const { rows: data, count } = await UsageInstruction.findAndCountAll({
        attributes: ['id', 'instruction', 'created_at', 'updated_at'],
        where: whereClause,
        order,
        limit,
        offset,
      });

      return {
        message: 'Usage instruction fetched successfully.',
        data: data.map(b => ({
          id: b.id,
          name: b.instruction,
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
      const instruction = await UsageInstruction.findByPk(id, {
        attributes: ['id', 'instruction']
      })

      if (!instruction) {
        throw new BadRequestException('Usage instruction not found')
      }

      const sanitized = {
        id: instruction.id ?? 'N/A',
        name: instruction.instruction ?? 'N/A',
      }

      return sanitized
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async create(body: CreateUsageInstructionDto, creator: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();

    try {
      // Find existing instruction, including soft-deleted
      const existing = await UsageInstruction.findOne({
        where: { instruction: body.instruction },
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
          throw new BadRequestException('Already exists');
        }
      }

      const data = await UsageInstruction.create(
        {
          instruction: body.instruction,
          creator_id: creator.id,
        },
        { transaction },
      );

      await transaction.commit();
      return data;
    } catch (error) {
      await transaction.rollback();
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException(error.message);
    }
  }

  async update(id: number, body: CreateUsageInstructionDto, updater: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const usageInstruction = await UsageInstruction.findByPk(id);
      if (!usageInstruction) throw new BadRequestException('Usage instruction not found');

      await usageInstruction.update(
        {
          instruction: body.instruction,
          updater_id: updater.id,
        },
        { transaction },
      );
      await transaction.commit();
      return usageInstruction;
    } catch (err) {
      await transaction.rollback();
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: number, deleter: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const usageInstruction = await UsageInstruction.findByPk(id);
      if (!usageInstruction) throw new BadRequestException('Usage instruction not found');

      await usageInstruction.update({ deleter_id: deleter.id });
      await usageInstruction.destroy({ transaction });

      await transaction.commit();
      return { message: 'Usage instruction deleted successfully' };
    } catch (err) {
      await transaction.rollback();
      throw new BadRequestException(err.message);
    }
  }
}