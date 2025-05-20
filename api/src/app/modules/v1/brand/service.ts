import Brand from "@/app/models/brand/brand.model";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Op, OrderItem } from "sequelize";

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
            const sortKey = params.sort || 'created';
            const sortOrder = params.order || 'desc';
            const search = params.search || '';

            const SORT_CONFIG: Record<string, OrderItem> = {
                brand_id: ['brand_id', sortOrder],
                brand_name: ['brand_name', sortOrder],
                created: ['created_at', sortOrder],
                updated: ['updated_at', sortOrder],
            };

            const order: OrderItem[] = SORT_CONFIG[sortKey] ? [SORT_CONFIG[sortKey]] : [['created_at', 'desc']];

            const whereClause = search
                ? {
                      brand_name: {
                          [Op.iLike]: `%${search}%`, // Use Op.like for MySQL
                      },
                  }
                : {};

            const { rows: data, count } = await Brand.findAndCountAll({
                where: whereClause,
                order,
                limit,
                offset,
            });

            return {
                message: 'Brands fetched successfully.',
                data,
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
}