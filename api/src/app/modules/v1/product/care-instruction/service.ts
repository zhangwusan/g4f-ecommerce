import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, OrderItem, Sequelize } from 'sequelize';
import sequelizeConfig from '@/config/sequelize.config';
import CareInstruction from '@/app/models/product/care-instruction.model';
import { CreateCareInstructionDto } from './dto';
import { UserDecoratorType } from '@/app/common/decorators/user.decorator';
import { BaseQueryDto } from '@/app/common/dto/base-query.dto';

@Injectable()
export class CareInstructionService {

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

      const { rows: data, count } = await CareInstruction.findAndCountAll({
        attributes: ['id', 'instruction', 'created_at', 'updated_at'],
        where: whereClause,
        order,
        limit,
        offset,
      });

      return {
        message: 'Care instruction fetched successfully.',
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
      const instruction = await CareInstruction.findByPk(id, {
        attributes: ['id', 'instruction']
      })

      if (!instruction) {
        throw new BadRequestException('Care instruction not found')
      }

      const sanitizedCareInstruction = {
        id: instruction.id ?? 'N/A',
        name: instruction.instruction ?? 'N/A',
      }

      return sanitizedCareInstruction
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async create(body: CreateCareInstructionDto, creator: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();

    try {
      // Find existing instruction, including soft-deleted
      const existing = await CareInstruction.findOne({
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
          throw new BadRequestException('Instruction already exists');
        }
      }

      const instruction = await CareInstruction.create(
        {
          instruction: body.instruction,
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

  async update(id: number, body: CreateCareInstructionDto, updater: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const instruction = await CareInstruction.findByPk(id);
      if (!instruction) throw new BadRequestException('Instruction not found');

      await instruction.update(
        {
          instruction: body.instruction,
          updater_id: updater.id,
        },
        { transaction },
      );
      await transaction.commit();
      return instruction;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number, deleter: UserDecoratorType) {
    const sequelize = new Sequelize(sequelizeConfig);
    const transaction = await sequelize.transaction();
    try {
      const instruction = await CareInstruction.findByPk(id);
      if (!instruction) throw new BadRequestException('Instruction not found');

      await instruction.update({ deleter_id: deleter.id });
      await instruction.destroy({ transaction });

      await transaction.commit();
      return { message: 'Care instruction deleted successfully' };
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}