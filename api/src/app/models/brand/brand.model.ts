import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
    DeletedAt,
} from 'sequelize-typescript';
import Product from '../product/product.model';

@Table({
    tableName: 'brands',
    timestamps: true,
    paranoid: true,
})
class Brand extends Model<Brand> {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'brand_id',
    })
    brand_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        field: 'brand_name',
    })
    brand_name!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;

    // Association: One brand has many products
    @HasMany(() => Product)
    products!: Product[];

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at!: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at!: Date;
    @DeletedAt @Column({ field: 'deleted_at', }) deleted_at!: Date;
}

export default Brand;